from fastapi import APIRouter, HTTPException
from schemas.predict_request import PredictRequest
from schemas.predict_response import PredictResponse, LabelData
from services.ai_service import load_detection_model
from typing import List

router = APIRouter()

@router.post("/predict", response_model=List[PredictResponse])
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
            predict_results = model.predict(
                source=image.image_url, 
                iou=request.iou_threshold, 
                conf=request.conf_threshold,
                classes=request.classes)
            results.append(predict_results[0])
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
                "imageHeight": result.orig_shape[0],
                "imageWidth": result.orig_shape[1],
                "imageDepth": 1
            }
            response.append({
                "image_id":image.image_id,
                "data":label_data
                })
    except Exception as e:
        raise HTTPException(status_code=500, detail="label parsing exception: "+str(e))
    return response