from fastapi import APIRouter, HTTPException
from schemas.predict_request import PredictRequest
from schemas.predict_response import PredictResponse
from services.ai_service import load_detection_model
from typing import List
import os

router = APIRouter()

@router.post("/predict", response_model=List[PredictResponse])
def predict(request: PredictRequest):
    version = "0.1.0"

    try:
        model = load_detection_model()
    except Exception as e:
        raise HTTPException(status_code=500, detail="load model exception: "+str(e))
    print(model)
    try:
        results = model.predict(
            source=request.image_path, 
            iou=request.iou_threshold, 
            conf=request.conf_threshold,
            classes=request.classes)
    except Exception as e:
        raise HTTPException(status_code=500, detail="model predict exception: "+str(e))
    try:
        response = [{
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
        } for result in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail="label parsing exception: "+str(e))
    return response