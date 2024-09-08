from fastapi import APIRouter, HTTPException
from schemas.predict_request import PredictRequest
from schemas.train_request import TrainRequest
from schemas.predict_response import PredictResponse, LabelData
from services.ai_service import load_detection_model
from utils.dataset_utils import split_data
from utils.file_utils import get_dataset_root_path, process_directories, process_image_and_label
from typing import List
from PIL import Image

router = APIRouter()
@router.post("/detection", response_model=List[PredictResponse])
def predict(request: PredictRequest):
    version = "0.1.0"

    # 모델 로드
    try:
        model = load_detection_model()
    except Exception as e:
        raise HTTPException(status_code=500, detail="load model exception: "+str(e))
    
    # 추론
    results = []
    try:
        for image in request.image_list:
            # URL에서 이미지를 메모리로 로드 TODO: 추후 메모리에 할지 어떻게 해야할지 or 병렬 처리 고민
            # response = requests.get(image.image_url)

            # 이미지 데이터를 메모리로 로드
            # img = Image.open(io.BytesIO(response.content))

            predict_results = model.predict(
                source=image.image_url,
                iou=request.iou_threshold, 
                conf=request.conf_threshold,
                classes=request.classes
            )
            results.append(predict_results[0])
            
            # 메모리에서 이미지 객체 해제
            # img.close()
            # del img
    except Exception as e:
        raise HTTPException(status_code=500, detail="model predict exception: "+str(e))
    
    # 추론 결과 -> 레이블 객체 파싱
    response = []
    try:
        for (image, result) in zip(request.image_list, results):
            label_data:LabelData = {
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
                "image_id":image.image_id,
                "image_url":image.image_url,
                "data":label_data
                })
    except Exception as e:
        raise HTTPException(status_code=500, detail="label parsing exception: "+str(e))
    return response


@router.post("/detection/train")
def train(request: TrainRequest):
    # 데이터셋 루트 경로 얻기
    dataset_root_path = get_dataset_root_path(request.project_id)
    
    # 디렉토리 생성 및 초기화
    process_directories(dataset_root_path)
    
    # 학습 데이터 분류
    train_data, val_data = split_data(request.data, request.ratio, request.seed)
    
    # 학습 데이터 처리
    for data in train_data:
        process_image_and_label(data, dataset_root_path, "train")

    # 검증 데이터 처리
    for data in val_data:
        process_image_and_label(data, dataset_root_path, "val")