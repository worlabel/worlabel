# ai_service.py

from ultralytics import YOLO # Ultralytics YOLO 모델을 가져오기
from ultralytics.models.yolo.model import YOLO as YOLO_Model
from ultralytics.nn.tasks import DetectionModel, SegmentationModel
import os
import torch
import re

def load_detection_model(model_path:str):
    """
    지정된 경로에서 YOLO 모델을 로드합니다.

    Args:
        model_path (str): 모델 파일 경로.
        device (str): 모델을 로드할 장치. 기본값은 'cpu'.
                      'cpu' 또는 'cuda'와 같은 장치를 지정할 수 있습니다.

    Returns:
        YOLO: 로드된 YOLO 모델 인스턴스
    """

    if model_path:
        model = load_model(model_path)
    else:
        model = YOLO(os.path.join("resources","models","yolov8n.pt"))
    # Detection 모델인지 검증
    if model.task != "detect":
        raise TypeError(f"Invalid model type: {model.task}. Expected a DetectionModel.")
    return model
    
def load_segmentation_model(model_path: str): 
    if model_path:
        model = YOLO(model_path)
    else:
        model = YOLO(os.path.join("resources","models","yolov8n-seg.pt"))
        
    # Segmentation 모델인지 검증
    if model.task != "segment":
        raise TypeError(f"Invalid model type: {model.task}. Expected a SegmentationModel.")
    return model

def load_model(model_path: str):
    # model_path 검증
    pattern = r'^resources[/\\]projects[/\\](\d+)[/\\]models[/\\]([a-f0-9\-]+)\.pt$'
    if not re.match(pattern, model_path):
        raise Exception("Invalid path format")

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at path: {model_path}")
    
    try:
        model = YOLO(model_path)
        if (torch.cuda.is_available()):
            model.to("cuda")
            print("gpu 활성화")
        else:
            model.to("cpu")
        return model
    except:
        raise Exception("YOLO model conversion failed: Unsupported architecture or invalid configuration.")
