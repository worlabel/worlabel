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
import asyncio


router = APIRouter()

@router.post("/predict")
async def detection_predict(request: PredictRequest):
    # Spring 서버의 WebSocket URL
    # TODO: 배포 시 변경
    spring_server_ws_url = f"ws://localhost:8080/ws"
    
    # WebSocketClient 인스턴스 생성
    ws_client = WebSocketClient(spring_server_ws_url)

    # 모델 로드
    try:
        model_path = request.m_key and get_model_path(request.project_id, request.m_key)
        model = load_detection_model(model_path=model_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail="load model exception: " + str(e))
    
    # 모델 레이블 카테고리 연결
    classes = None
    if request.label_map:
        classes = list(request.label_map)


    # 웹소켓 연결
    try:
        await ws_client.connect()
        if not ws_client.is_connected():
            raise WebSocketConnectionException()

        # 추론
        total_images = len(request.image_list)
        for idx, image in enumerate(request.image_list):
            try:
                # URL에서 이미지를 메모리로 로드 TODO: 추후 메모리에 할지 어떻게 해야할지 or 병렬 처리 고민
                predict_results = model.predict(
                    source=image.image_url,
                    iou=request.iou_threshold,
                    conf=request.conf_threshold,
                    classes=classes
                )
                # 예측 결과 처리
                result = predict_results[0]
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
                    "result": response_item.model_dump()
                }

                await ws_client.send_message("/app/ai/predict/progress", json.dumps(message))

            except Exception as e:
                raise HTTPException(status_code=500, detail="model predict exception: " + str(e))
        return Response(status_code=204)
    
    # 웹소켓 연결 안된 경우
    except WebSocketConnectionException as e:
        # 추론
        response = []
        for image in request.image_list:
            try:
                predict_results = model.predict(
                    source=image.image_url,
                    iou=request.iou_threshold,
                    conf=request.conf_threshold,
                    classes=classes
                )
                # 예측 결과 처리
                result = predict_results[0]
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

                response_item = PredictResponse(
                    image_id=image.image_id,
                    image_url=image.image_url,
                    data=label_data
                )

                response.append(response_item)

            except Exception as e:
                raise HTTPException(status_code=500, detail="model predict exception: " + str(e))
            
        return response
    except Exception as e:
        print(f"Prediction process failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Prediction process failed")

    finally:
        if ws_client.is_connected():
            await ws_client.close()


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
    train_data, val_data = split_data(request.data, request.ratio, request.seed)

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

        model = load_detection_model("test-data/model/best.pt")
        model.train(
            data=join_path(dataset_root_path, "dataset.yaml"),
            name=join_path(dataset_root_path, "result"),
            epochs=request.epochs,
            batch=request.batch,
        )
        # return FileResponse(path=join_path(dataset_root_path, "result", "weights", "best.pt"), filename="best.pt", media_type="application/octet-stream")
        return {"status": "Training completed successfully"}
    
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
        )

        model_key = save_model(project_id=request.project_id, path=join_path(dataset_root_path, "result", "weights", "last.pt"))

        return {"model_key": model_key, "results": results.results_dict}


    except Exception as e:
        print(f"Training process failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Training process failed")

    finally:
        if ws_client.is_connected():
            await ws_client.close()
