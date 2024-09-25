import json

from fastapi import APIRouter, HTTPException
from schemas.predict_request import PredictRequest
from schemas.train_request import TrainRequest
from schemas.predict_response import PredictResponse, LabelData
from schemas.train_report_data import ReportData
from services.load_model import load_detection_model
from services.create_model import save_model
from utils.dataset_utils import split_data
from utils.file_utils import get_dataset_root_path, process_directories, process_image_and_label, join_path
from utils.slackMessage import send_slack_message
import asyncio, httpx


router = APIRouter()

@router.post("/predict")
async def detection_predict(request: PredictRequest):

    send_slack_message(f"predict 요청{request}", status="success")

    # 모델 로드
    model = get_model(request)
    
    # 모델 레이블 카테고리 연결
    classes = list(request.label_map) if request.label_map else None

    # 이미지 데이터 정리
    url_list = list(map(lambda x:x.image_url, request.image_list))


    # 추론
    try:
        results = run_predictions(model, url_list, request, classes)
        print(len(results))
        print(len(request.image_list))
        response = [process_prediction_result(result, image, request.label_map) for result, image in zip(results,request.image_list)]
        return response

    except Exception as e:
        # 실패했을 때 Slack 알림
        send_slack_message(f"프로젝트 ID: {request.project_id} - 실패! 에러: {str(e)}",status="error")
        raise HTTPException(status_code=500, detail="Prediction process failed")

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
    label_data = LabelData(
        version="0.0.0",
        task_type="det",
        shapes=[
            {
                "label": summary['name'],
                "color": "#ff0000",
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

    return PredictResponse(
        image_id=image.image_id,
        data=json.dumps(label_data.dict())
    )



@router.post("/train")
async def detection_train(request: TrainRequest):

    send_slack_message(f"train 요청{request}", status="success")

    # 데이터셋 루트 경로 얻기
    dataset_root_path = get_dataset_root_path(request.project_id)

    # 모델 로드
    model = get_model(request)

    # 학습할 모델 카테고리 정리 카테고리가 추가되는 경우에 추가할 수 있게
    names = model.names

    # 디렉토리 생성 및 초기화
    process_directories(dataset_root_path, names)

    # 레이블 맵
    inverted_label_map = {value: key for key, value in request.label_map.items()} if request.label_map else None

    # 학습 데이터 분류
    train_data, val_data = split_data(request.data, request.ratio)

    try:
        # 학습 데이터 처리
        for data in train_data:
            process_image_and_label(data, dataset_root_path, "train", inverted_label_map)

        # 검증 데이터 처리
        for data in val_data:
            process_image_and_label(data, dataset_root_path, "val", inverted_label_map)

        def send_data(trainer):
            # 첫번째 epoch는 스킵
            if trainer.epoch == 0:
                return

            ## 남은 시간 계산(초)
            left_epochs = trainer.epochs-trainer.epoch
            left_seconds = left_epochs*trainer.epoch_time
            ## 로스 box_loss, cls_loss, dfl_loss
            loss = trainer.label_loss_items(loss_items=trainer.loss_items)
            data = ReportData(
                epoch= trainer.epoch,             # 현재 에포크
                total_epochs= trainer.epochs,     # 전체 에포크
                box_loss= loss["train/box_loss"], # box loss
                cls_loss= loss["train/cls_loss"], # cls loss
                dfl_loss= loss["train/dfl_loss"], # dfl loss
                fitness= trainer.fitness,         # 적합도
                epoch_time= trainer.epoch_time,   # 지난 에포크 걸린 시간 (에포크 시작 기준으로 결정)
                left_seconds= left_seconds        # 남은 시간(초)
            )
            # 데이터 전송

        model.add_callback("on_train_epoch_start", send_data)

        results = model.train(
            data=join_path(dataset_root_path, "dataset.yaml"),
            name=join_path(dataset_root_path, "result"),
            epochs=request.epochs,
            batch=request.batch,
            lr0=request.lr0,
            lrf=request.lrf,
            optimizer=request.optimizer
        )

        model_key = save_model(project_id=request.project_id, path=join_path(dataset_root_path, "result", "weights", "best.pt"))

        return {"model_key": model_key, "results": results.results_dict}
    except Exception as e:

        raise HTTPException(status_code=500, detail="model train exception: " + str(e))


