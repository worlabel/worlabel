from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from schemas.predict_request import PredictRequest
from schemas.train_request import TrainRequest, TrainDataInfo
from schemas.predict_response import PredictResponse, LabelData, Shape
from schemas.train_report_data import ReportData
from schemas.train_response import TrainResponse
from services.load_model import load_detection_model
from services.create_model import save_model
from utils.file_utils import get_dataset_root_path, process_directories, join_path, process_image_and_label
from utils.slackMessage import send_slack_message
from utils.api_utils import send_data_call_api
import random


router = APIRouter()

@router.post("/predict")
async def detection_predict(request: PredictRequest):

    send_slack_message(f"predict 요청: {request}", status="success")

    # 모델 로드
    model = get_model(request.project_id, request.m_key)

    # 이미지 데이터 정리
    url_list = list(map(lambda x:x.image_url, request.image_list))

    # 이 값을 모델에 입력하면 해당하는 클래스 id만 출력됨
    classes = get_classes(request.label_map, model.names)

    # 추론
    results = await run_predictions(model, url_list, request, classes)

    # 추론 결과 변환
    response = [process_prediction_result(result, image, request.label_map) for result, image in zip(results,request.image_list)]
    send_slack_message(f"predict 성공{response}", status="success")
    return response

# 모델 로드
def get_model(project_id, model_key):
    try:
        return load_detection_model(project_id, model_key)
    except Exception as e:
        raise HTTPException(status_code=500, detail="exception in get_model(): " + str(e))

# 모델의 레이블로부터 label_map의 key에 존재하는 값의 id만 가져오기
def get_classes(label_map:dict[str: int], model_names: dict[int, str]):
    try:
        return [id for id, name in model_names.items() if name in label_map]
    except Exception as e:
        raise HTTPException(status_code=500, detail="exception in get_classes(): " + str(e))

# 추론 실행 함수
async def run_predictions(model, image, request, classes):
    try:
        result = await run_in_threadpool(
            model.predict, 
            source=image,
            iou=request.iou_threshold,
            conf=request.conf_threshold,
            classes=classes
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail="exception in run_predictions: " + str(e))
    

# 추론 결과 처리 함수
def process_prediction_result(result, image, label_map):
    try:
        label_data = LabelData(
            version="0.0.0",
            task_type="det",
            shapes=[
                Shape(
                    label= summary['name'],
                    color= get_random_color(),
                    points= [
                        [summary['box']['x1'], summary['box']['y1']],
                        [summary['box']['x2'], summary['box']['y2']]
                    ],
                    group_id= label_map[summary['name']],
                    shape_type= "rectangle",
                    flags= {}
                )
                for summary in result.summary()
            ],
            split="none",
            imageHeight=result.orig_img.shape[0],
            imageWidth=result.orig_img.shape[1],
            imageDepth=result.orig_img.shape[2]
        )
    except KeyError as e:
        raise HTTPException(status_code=500, detail="KeyError: " + str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="exception in process_prediction_result(): " + str(e))

    return PredictResponse(
        image_id=image.image_id,
        data=label_data.model_dump_json()
    )

def get_random_color():
    random_number = random.randint(0, 0xFFFFFF)
    return f"#{random_number:06X}"

@router.post("/train")
async def detection_train(request: TrainRequest):

    send_slack_message(f"train 요청{request}", status="success")

    # 데이터셋 루트 경로 얻기 (프로젝트 id 기반)
    dataset_root_path = get_dataset_root_path(request.project_id)

    # 모델 로드
    model = get_model(request.project_id, request.m_key)

    # 이 값을 학습할때 넣으면 이 카테고리들이 학습됨
    names = list(request.label_map)

    # 레이블 변환기 (file_util.py/create_detection_train_label() 에 쓰임)
    label_converter = {request.label_map[key]:idx for idx, key in enumerate(request.label_map)}
    # key : 데이터에 저장된 프로젝트 카테고리 id
    # value : 모델에 저장될 카테고리 id (모델에는 key의 idx 순서대로 저장될 것임)
    
    # 데이터 전처리: 학습할 디렉토리 & 데이터셋 설정 파일을 생성
    process_directories(dataset_root_path, names)

    # 데이터 전처리: 데이터를 학습데이터와 검증데이터로 분류
    train_data, val_data = split_data(request.data, request.ratio)
    

    # 데이터 전처리: 데이터 이미지 및 레이블 다운로드
    download_data(train_data, val_data, dataset_root_path, label_converter)

    # 학습
    results = await run_train(request, model,dataset_root_path)

    # best 모델 저장
    model_key = save_model(project_id=request.project_id, path=join_path(dataset_root_path, "result", "weights", "best.pt"))
    
    result = results.results_dict

    response = TrainResponse(
        modelKey=model_key,
        precision= result["metrics/precision(B)"],
        recall= result["metrics/recall(B)"],
        mAP50= result["metrics/mAP50(B)"],
        mAP5095= result["metrics/mAP50-95(B)"],
        accuracy=0,
        fitness= result["fitness"]
    )
    send_slack_message(f"train 성공{response}", status="success")
        
    return response

def split_data(data:list[TrainDataInfo], ratio:float):
    try:
        train_size = int(ratio * len(data))
        random.shuffle(data)
        train_data = data[:train_size]
        val_data = data[train_size:]
        return train_data, val_data
    except Exception as e:
        raise HTTPException(status_code=500, detail="exception in split_data(): " + str(e))

def download_data(train_data:list[TrainDataInfo], val_data:list[TrainDataInfo], dataset_root_path:str, label_converter:dict[int, int]):
    try:
        for data in train_data:
            process_image_and_label(data, dataset_root_path, "train", label_converter)

        for data in val_data:
            process_image_and_label(data, dataset_root_path, "val", label_converter)
    except Exception as e:
        raise HTTPException(status_code=500, detail="exception in download_data(): " + str(e))
    
async def run_train(request, model, dataset_root_path):
    try:
        # 데이터 전송 콜백함수
        def send_data(trainer):
            try:
                # 첫번째 epoch는 스킵
                if trainer.epoch == 0:
                    return

                # 남은 시간 계산(초)
                left_epochs = trainer.epochs - trainer.epoch
                left_seconds = left_epochs * trainer.epoch_time

                # 로스 box_loss, cls_loss, dfl_loss
                loss = trainer.label_loss_items(loss_items=trainer.loss_items)
                data = ReportData(
                    epoch=trainer.epoch,             # 현재 에포크
                    total_epochs=trainer.epochs,     # 전체 에포크
                    seg_loss=0,                      # seg_loss
                    box_loss=loss["train/box_loss"], # box loss
                    cls_loss=loss["train/cls_loss"], # cls loss
                    dfl_loss=loss["train/dfl_loss"], # dfl loss
                    fitness=trainer.fitness,         # 적합도
                    epoch_time=trainer.epoch_time,   # 지난 에포크 걸린 시간 (에포크 시작 기준으로 결정)
                    left_seconds=left_seconds        # 남은 시간(초)
                )
                # 데이터 전송
                send_data_call_api(request.project_id, request.m_id, data)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"exception in send_data(): {e}")

        # 콜백 등록
        model.add_callback("on_train_epoch_start", send_data)

        # 학습 실행
        results =  await run_in_threadpool(model.train,
            data=join_path(dataset_root_path, "dataset.yaml"),
            name=join_path(dataset_root_path, "result"),
            epochs=request.epochs,
            batch=request.batch,
            lr0=request.lr0,
            lrf=request.lrf,
            optimizer=request.optimizer
        )
        
        # 마지막 에포크 전송
        model.trainer.epoch += 1
        send_data(model.trainer)
        return results


    except HTTPException as e:
        raise e # HTTP 예외를 다시 발생
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"exception in run_train(): {e}")


