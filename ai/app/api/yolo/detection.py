from fastapi import APIRouter, HTTPException, Request
from schemas.predict_request import PredictRequest
from schemas.train_request import TrainRequest
from schemas.predict_response import PredictResponse, LabelData
from schemas.train_report_data import ReportData
from schemas.train_response import TrainResponse
from services.load_model import load_detection_model
from services.create_model import save_model
from utils.dataset_utils import split_data
from utils.file_utils import get_dataset_root_path, process_directories, process_image_and_label, join_path
from utils.slackMessage import send_slack_message
from utils.api_utils import send_data_call_api
import random


router = APIRouter()

@router.post("/predict")
async def detection_predict(request: PredictRequest):

    send_slack_message(f"predict 요청: {request}", status="success")

    # 모델 로드
    model = get_model(request)
    
    # 모델 레이블 카테고리 연결
    classes = list(request.label_map) if request.label_map else None

    # 이미지 데이터 정리
    url_list = list(map(lambda x:x.image_url, request.image_list))

    # 추론
    results = run_predictions(model, url_list, request, classes)

    # 추론 결과 변환
    response = [process_prediction_result(result, image, request.label_map) for result, image in zip(results,request.image_list)]
    send_slack_message(f"predict 성공{response}", status="success")
    return response

# 모델 로드
def get_model(request: PredictRequest):
    try:
        return load_detection_model(request.project_id, request.m_key)
    except Exception as e:
        raise HTTPException(status_code=500, detail="load model exception: " + str(e))

# 추론 실행 함수
def run_predictions(model, image, request, classes):
    try:
        return model.predict(
            source=image,
            iou=request.iou_threshold,
            conf=request.conf_threshold,
            classes=classes
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="model predict exception: " + str(e))
    

# 추론 결과 처리 함수
def process_prediction_result(result, image, label_map):
    try:
        label_data = LabelData(
            version="0.0.0",
            task_type="det",
            shapes=[
                {
                    "label": summary['name'],
                    "color": get_random_color(),
                    "points": [
                        [summary['box']['x1'], summary['box']['y1']],
                        [summary['box']['x2'], summary['box']['y2']]
                    ],
                    "group_id": label_map[summary['class']] if label_map else summary['class'],
                    "shape_type": "rectangle",
                    "flags": {}
                }
                for summary in result.summary()
            ],
            split="none",
            imageHeight=result.orig_img.shape[0],
            imageWidth=result.orig_img.shape[1],
            imageDepth=result.orig_img.shape[2]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="model predict exception: " + str(e))

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
    
    try:
        # 레이블 맵
        inverted_label_map = {value: key for key, value in request.label_map.items()} if request.label_map else None

        # 데이터셋 루트 경로 얻기
        dataset_root_path = get_dataset_root_path(request.project_id)

        # 모델 로드
        model = get_model(request)

        # 학습할 모델 카테고리, 카테고리가 추가되는 경우 추가 작업 필요
        model_categories = model.names
        
        # 데이터 전처리
        preprocess_dataset(dataset_root_path, model_categories, request.data, request.ratio, inverted_label_map)

        # 학습
        results = run_train(request, model,dataset_root_path)

        # best 모델 저장
        model_key = save_model(project_id=request.project_id, path=join_path(dataset_root_path, "result", "weights", "best.pt"))
        
        result = results.results_dict

        response = TrainResponse(
            modelKey=model_key,
            precision= result["metrics/precision(B)"],
            recall= result["metrics/recall(B)"],
            mAP50= result["metrics/mAP50(B)"],
            mAP5095= result["metrics/mAP50-95(B)"],
            fitness= result["fitness"]
        )
        send_slack_message(f"train 성공{response}", status="success")
            
        return response

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def preprocess_dataset(dataset_root_path, model_categories, data, ratio, label_map):
    try:
        # 디렉토리 생성 및 초기화
        process_directories(dataset_root_path, model_categories)

        # 학습 데이터 분류
        train_data, val_data = split_data(data, ratio)
        if not train_data or not val_data:
            raise HTTPException(status_code=400, detail="data split exception: data size is too small or \"ratio\" has invalid value")

        # 학습 데이터 처리
        for data in train_data:
            process_image_and_label(data, dataset_root_path, "train", label_map)

        # 검증 데이터 처리
        for data in val_data:
            process_image_and_label(data, dataset_root_path, "val", label_map)

    except HTTPException as e:
        raise e  # HTTP 예외를 다시 발생
    except Exception as e:
        raise HTTPException(status_code=500, detail="preprocess dataset exception: " + str(e))
    
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
                    epoch=trainer.epoch,             # 현재 에포크
                    total_epochs=trainer.epochs,     # 전체 에포크
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
                raise HTTPException(status_code=500, detail=f"send_data exception: {e}")

        # 콜백 등록
        model.add_callback("on_train_epoch_start", send_data)

        # 학습 실행
        results = model.train(
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
        raise HTTPException(status_code=500, detail=f"run_train exception: {e}")


