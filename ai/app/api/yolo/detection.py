import json

from fastapi import APIRouter, HTTPException
from schemas.predict_request import PredictRequest
from schemas.train_request import TrainRequest
from schemas.predict_response import PredictResponse, LabelData
from app.services.load_model import load_detection_model
from utils.dataset_utils import split_data
from utils.file_utils import get_dataset_root_path, process_directories, process_image_and_label, join_path
from typing import List
from utils.websocket_utils import WebSocketClient
import asyncio


router = APIRouter()


@router.post("/detection", response_model=List[PredictResponse])
async def predict(request: PredictRequest):
    version = "0.1.0"
    print("여기")

    # Spring 서버의 WebSocket URL
    # TODO: 배포 시 변경
    spring_server_ws_url = f"ws://localhost:8080/ws"
    
    print("여기")
    # WebSocketClient 인스턴스 생성
    ws_client = WebSocketClient(spring_server_ws_url)

    try:
        await ws_client.connect()

        # 모델 로드
        try:
            model = load_detection_model()
        except Exception as e:
            raise HTTPException(status_code=500, detail="load model exception: " + str(e))

        # 추론
        results = []
        total_images = len(request.image_list)
        for idx, image in enumerate(request.image_list):
            try:
                # URL에서 이미지를 메모리로 로드 TODO: 추후 메모리에 할지 어떻게 해야할지 or 병렬 처리 고민

                predict_results = model.predict(
                    source=image.image_url,
                    iou=request.iou_threshold,
                    conf=request.conf_threshold,
                    classes=request.classes
                )
                # 예측 결과 처리
                result = predict_results[0]
                label_data = LabelData(
                    version=version,
                    task_type="det",
                    shapes=[
                        {
                            "label": summary['name'],
                            "color": "#ff0000",
                            "points": [
                                [summary['box']['x1'], summary['box']['y1']],
                                [summary['box']['x2'], summary['box']['y2']]
                            ],
                            "group_id": summary['class'],
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

                response_item = PredictResponse(
                    image_id=image.image_id,
                    image_url=image.image_url,
                    data=label_data
                )

                # 진행률 계산
                progress = (idx + 1) / total_images * 100

                # 웹소켓으로 예측 결과와 진행률 전송
                message = {
                    "project_id": request.project_id,
                    "progress": progress,
                    "result": response_item.dict()
                }

                await ws_client.send_message("/app/ai/predict/progress", json.dumps(message))

            except Exception as e:
                raise HTTPException(status_code=500, detail="model predict exception: " + str(e))

        # 추론 결과 -> 레이블 객체 파싱
        response = []
        try:
            for (image, result) in zip(request.image_list, results):
                label_data: LabelData = {
                    "version": version,
                    "task_type": "det",
                    "shapes": [
                        {
                            "label": summary['name'],
                            "color": "#ff0000",
                            "points": [
                                [summary['box']['x1'], summary['box']['y1']],
                                [summary['box']['x2'], summary['box']['y2']]
                            ],
                            "group_id": summary['class'],
                            "shape_type": "rectangle",
                            "flags": {}
                        }
                        for summary in result.summary()
                    ],
                    "split": "none",
                    "imageHeight": result.orig_img.shape[0],
                    "imageWidth": result.orig_img.shape[1],
                    "imageDepth": result.orig_img.shape[2]
                }
                response.append({
                    "image_id": image.image_id,
                    "image_url": image.image_url,
                    "data": label_data
                })
        except Exception as e:
            raise HTTPException(status_code=500, detail="label parsing exception: " + str(e))

        return response

    except Exception as e:
        print(f"Prediction process failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Prediction process failed")

    finally:
        if ws_client.is_connected():
            await ws_client.close()


@router.post("/detection/train")
async def train(request: TrainRequest):
    # 데이터셋 루트 경로 얻기
    dataset_root_path = get_dataset_root_path(request.project_id)

    # 디렉토리 생성 및 초기화
    process_directories(dataset_root_path)

    # 학습 데이터 분류
    train_data, val_data = split_data(request.data, request.ratio, request.seed)

    # Spring 서버의 WebSocket URL
    # TODO: 배포시에 변경
    spring_server_ws_url = f"ws://localhost:8080/ws"
    
    # WebSocketClient 인스턴스 생성
    ws_client = WebSocketClient(spring_server_ws_url)


    try:
        await ws_client.connect()

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

        model = load_detection_model("test-data/model/best.pt")
        model.train(
            data=join_path(dataset_root_path, "dataset.yaml"),
            name=join_path(dataset_root_path, "result"),
            epochs=request.epochs,
            batch=request.batch,
        )

        # return FileResponse(path=join_path(dataset_root_path, "result", "weights", "best.pt"), filename="best.pt", media_type="application/octet-stream")

        return {"status": "Training completed successfully"}

    except Exception as e:
        print(f"Training process failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Training process failed")

    finally:
        if ws_client.is_connected():
            await ws_client.close()
    


    
