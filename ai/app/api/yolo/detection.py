import json

from fastapi import APIRouter, HTTPException, Response
from schemas.predict_request import PredictRequest
from schemas.train_request import TrainRequest
from schemas.predict_response import PredictResponse, LabelData
from services.load_model import load_detection_model
from services.create_model import save_model
from utils.dataset_utils import split_data
from utils.file_utils import get_dataset_root_path, process_directories, process_image_and_label, join_path, get_model_path
from utils.websocket_utils import WebSocketClient, WebSocketConnectionException
from utils.slackMessage import send_slack_message
import asyncio
import time


router = APIRouter()

@router.post("/predict")
async def detection_predict(request: PredictRequest):

    send_slack_message(f"predict 요청{request}", status="success")

    # Spring 서버의 WebSocket URL
    # TODO: 배포 시 변경
    # spring_server_ws_url = f"ws://localhost:8080/ws"
    
    # WebSocketClient 인스턴스 생성
    # ws_client = WebSocketClient(spring_server_ws_url)

    # 모델 로드
    model = load_model(request)
    
    # 모델 레이블 카테고리 연결
    classes = list(request.label_map) if request.label_map else None

    # 결과를 저장할 리스트
    response = []

    # 웹소켓 연결
    # await connect_to_websocket(ws_client)

    # 추론
    try:
        for idx, image in enumerate(request.image_list):
            result = run_predictions(model, image, request, classes)
            response_item = process_prediction_result(result, request, image)
            response.append(response_item)

        return response

    except Exception as e:
        # 실패했을 때 Slack 알림
        send_slack_message(f"프로젝트 ID: {request.project_id} - 실패! 에러: {str(e)}",status="error")
        raise HTTPException(status_code=500, detail="Prediction process failed")

    # finally:
    #     send_slack_message("종료")
        # if ws_client.is_connected():
        #     await ws_client.close()

# 모델 로드
def load_model(request: PredictRequest):
    try:
        model_path = request.m_key and get_model_path(request.project_id, request.m_key)
        return load_detection_model(model_path=model_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail="load model exception: " + str(e))

# 웹소켓 연결
async def connect_to_websocket(ws_client):
    try:
        await ws_client.connect()
        if not ws_client.is_connected():
            raise WebSocketConnectionException("웹 소켓 연결 실패")
    except Exception as e:
        raise HTTPException(status_code=500, detail="websocket connect failed: " + str(e))

# 추론 실행 함수
def run_predictions(model, image, request, classes):
    try:
        predict_results = model.predict(
            source=image.image_url,
            iou=request.iou_threshold,
            conf=request.conf_threshold,
            classes=classes
        )
        return predict_results[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail="model predict exception: " + str(e))

# 추론 결과 처리 함수
def process_prediction_result(result, request, image):
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
                "group_id": request.label_map[summary['class']] if request.label_map else summary['class'],
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
    # Spring 서버의 WebSocket URL
    # TODO: 배포시에 변경
    spring_server_ws_url = f"ws://localhost:8080/ws"
    
    # WebSocketClient 인스턴스 생성
    ws_client = WebSocketClient(spring_server_ws_url)

    # 데이터셋 루트 경로 얻기
    dataset_root_path = get_dataset_root_path(request.project_id)

    # 모델 로드
    try:
        model_path = request.m_key and get_model_path(request.project_id, request.m_key)
        model = load_detection_model(model_path=model_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail="load model exception: " + str(e))

    # 학습할 모델 카테고리 정리 카테고리가 추가되는 경우에 추가할 수 있게
    names = model.names

    # 디렉토리 생성 및 초기화
    process_directories(dataset_root_path, names)

    # 레이블 맵
    inverted_label_map = None
    if request.label_map:
        inverted_label_map =  {value: key for key, value in request.label_map.items()}

    # 학습 데이터 분류
    train_data, val_data = split_data(request.data, request.ratio)

    try:
        await ws_client.connect()
        if not ws_client.is_connected():
            raise WebSocketConnectionException()

        # 학습 데이터 처리
        total_data = len(train_data)
        for idx, data in enumerate(train_data):
            # TODO: 비동기면 await 연결
            # process_image_and_label(data, dataset_root_path, "train")
            
            # 진행률 계산
            progress = (idx + 1) / total_data * 100
            
            await ws_client.send_message("/app/ai/train/progress", f"학습 데이터 처리 중 {request.project_id}: {progress:.2f}% 완료")

        # 검증 데이터 처리
        total_val_data = len(val_data)
        for idx, data in enumerate(val_data):
            # TODO: 비동기면 await 연결
            # process_image_and_label(data, dataset_root_path, "val")

            # 진행률 계산
            progress = (idx + 1) / total_val_data * 100
            # 웹소켓으로 메시지 전송 (필요할 경우 추가)
            await ws_client.send_message("/app/ai/val/progress", f"검증 데이터 처리 중 {request.project_id}: {progress:.2f}% 완료")

        from ultralytics.models.yolo.detect import DetectionTrainer

        def send_data(trainer):
            # 첫번째 epoch는 스킵
            if trainer.epoch == 0:
                return

            ## 남은 시간 계산(초)
            left_epochs = trainer.epochs-trainer.epoch
            left_sec = left_epochs*trainer.epoch_time
            ## 로스 box_loss, cls_loss, dfl_loss
            loss = trainer.label_loss_items(loss_items=trainer.loss_items)
            data = {
                "epoch": trainer.epoch,             # 현재 에포크
                "total_epochs": trainer.epochs,     # 전체 에포크
                "box_loss": loss["box_loss"],       # box loss
                "cls_loss": loss["cls_loss"],       # cls loss
                "dfl_loss": loss["dfl_loss"],       # dfl loss
                "fitness": trainer.fitness,         # 적합도
                "epoch_time": trainer.epoch_time,   # 지난 에포크 걸린 시간 (에포크 시작 기준으로 결정)
                "left_second": left_sec             # 남은 시간(초)
            }
            # 데이터 전송
            ws_client.send_message() 

        model.add_callback("on_train_epoch_start", send_data)

        model.train(
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
    
    except WebSocketConnectionException as e:

         # 학습 데이터 처리
        total_data = len(train_data)
        for idx, data in enumerate(train_data):
            # TODO: 비동기면 await 연결
            process_image_and_label(data, dataset_root_path, "train", inverted_label_map)

        # 검증 데이터 처리
        total_val_data = len(val_data)
        for idx, data in enumerate(val_data):
            # TODO: 비동기면 await 연결
            process_image_and_label(data, dataset_root_path, "val", inverted_label_map)

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
        print(f"Training process failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Training process failed")

    finally:
        if ws_client.is_connected():
            await ws_client.close()


