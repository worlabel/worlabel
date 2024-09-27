from fastapi import APIRouter, HTTPException
from api.yolo.detection import run_predictions, get_random_color, split_data
from schemas.predict_request import PredictRequest
from schemas.train_request import TrainRequest, TrainDataInfo
from schemas.predict_response import PredictResponse, LabelData, Shape
from schemas.train_report_data import ReportData
from schemas.train_response import TrainResponse
from services.load_model import load_classification_model
from services.create_model import save_model
from utils.file_utils import get_dataset_root_path, process_directories_in_cls, process_image_and_label_in_cls, join_path
from utils.slackMessage import send_slack_message
from utils.api_utils import send_data_call_api

router = APIRouter()

@router.post("/predict")
async def classification_predict(request: PredictRequest):

    send_slack_message(f"predict 요청: {request}", status="success")

    # 모델 로드
    model = get_model(request.project_id, request.m_key)

    # 이미지 데이터 정리
    url_list = list(map(lambda x:x.image_url, request.image_list))

    # 추론
    results = run_predictions(model, url_list, request, classes=[]) # classification은 classes를 무시함

    # 추론 결과 변환
    response = [process_prediction_result(result, image, request.label_map) for result, image in zip(results,request.image_list)]
    send_slack_message(f"predict 성공{response}", status="success")
    return response

# 모델 로드
def get_model(project_id:int, model_key:str):
    try:
        return load_classification_model(project_id, model_key)
    except Exception as e:
        raise HTTPException(status_code=500, detail="exception in get_model(): " + str(e)) 

# 추론 결과 처리 함수
def process_prediction_result(result, image, label_map):
    try:
        label_name = None
        # top 5에 해당하는 class id 순회
        for class_id in result.probs.top5:
            name = result.names[class_id]   # class id에 해당하는 label_name
            if name in label_map:           # name이 사용자 레이블 카테고리에 있을 경우
                label_name = name           # label_name 설정
                break

        label_data = LabelData(
            version="0.0.0",
            task_type="cls",
            shapes=[],
            split="none",
            imageHeight=result.orig_img.shape[0],
            imageWidth=result.orig_img.shape[1],
            imageDepth=result.orig_img.shape[2]
        )

        if label_name:   # label_name을 설정한게 있다면 추가
            shape = Shape(
                label= label_name,
                color= get_random_color(),
                points= [[0.0, 0.0]],
                group_id= label_map[label_name],
                shape_type= 'point',
                flags= {}
            )
            LabelData.shapes.append(shape)
    
        return PredictResponse(
            image_id=image.image_id,
            data=label_data.model_dump_json()
        )
    except KeyError as e:
        raise HTTPException(status_code=500, detail="KeyError: " + str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="exception in process_prediction_result(): " + str(e))


@router.post("/train")
async def classification_train(request: TrainRequest):

    send_slack_message(f"train 요청{request}", status="success")

    # 데이터셋 루트 경로 얻기 (프로젝트 id 기반)
    dataset_root_path = get_dataset_root_path(request.project_id)

    # 모델 로드
    model = get_model(request.project_id, request.m_key)

    # 이 값을 학습할때 넣으면 이 카테고리들이 학습됨
    names = list(request.label_map)
    
    # 데이터 전처리: 학습할 디렉토리 & 데이터셋 설정 파일을 생성
    process_directories_in_cls(dataset_root_path, names)

    # 데이터 전처리: 데이터를 학습데이터와 테스트 데이터로 분류
    train_data, test_data = split_data(request.data, request.ratio)

    # 데이터 전처리: 데이터 이미지 및 레이블 다운로드
    download_data(train_data, test_data, dataset_root_path)

    # 학습
    results = run_train(request, model,dataset_root_path)

    # best 모델 저장
    model_key = save_model(project_id=request.project_id, path=join_path(dataset_root_path, "result", "weights", "best.pt"))
    
    result = results.results_dict

    response = TrainResponse(
        modelKey=model_key,
        precision= 0,
        recall= 0,
        mAP50= 0,
        mAP5095= 0,
        accuracy=result["accuracy_top1"],
        fitness= result["fitness"]
    )

    send_slack_message(f"train 성공{response}", status="success")
            
    return response

def download_data(train_data:list[TrainDataInfo], test_data:list[TrainDataInfo], dataset_root_path:str):
    try:
        for data in train_data:
            process_image_and_label_in_cls(data, dataset_root_path, "train")

        for data in test_data:
            process_image_and_label_in_cls(data, dataset_root_path, "test")
    except Exception as e:
        raise HTTPException(status_code=500, detail="exception in download_data(): " + str(e))

    
def run_train(request, model, dataset_root_path):
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
                    epoch=trainer.epoch,            # 현재 에포크
                    total_epochs=trainer.epochs,    # 전체 에포크
                    seg_loss=0,                     # seg loss
                    box_loss=0,                     # box loss
                    cls_loss=loss["train/loss"],    # cls loss
                    dfl_loss=0,                     # dfl loss
                    fitness=trainer.fitness,        # 적합도
                    epoch_time=trainer.epoch_time,  # 지난 에포크 걸린 시간 (에포크 시작 기준으로 결정)
                    left_seconds=left_seconds       # 남은 시간(초)
                )
                # 데이터 전송
                send_data_call_api(request.project_id, request.m_id, data)
            except Exception as e:
                raise HTTPException(status_code=500, detail="exception in send_data: "+ str(e))

        # 콜백 등록
        model.add_callback("on_train_epoch_start", send_data)

        # 학습 실행
        results = model.train(
            data=dataset_root_path,
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
        raise HTTPException(status_code=500, detail="exception in run_train(): "+str(e))


