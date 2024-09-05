# ai_service.py

from ultralytics import YOLO # Ultralytics YOLO 모델을 가져오기
from ultralytics.models.yolo.model import YOLO as YOLO_Model
from ultralytics.nn.tasks import DetectionModel 
import os
import torch

def load_detection_model(model_path: str = "test-data/model/yolov8n.pt", device:str ="auto"): 
    """
    지정된 경로에서 YOLO 모델을 로드합니다.

    Args:
        model_path (str): 모델 파일 경로.
        device (str): 모델을 로드할 장치. 기본값은 'cpu'.
                      'cpu' 또는 'cuda'와 같은 장치를 지정할 수 있습니다.

    Returns:
        YOLO: 로드된 YOLO 모델 인스턴스
    """
    
    if not os.path.exists(model_path) and model_path != "test-data/model/yolov8n.pt":
        raise FileNotFoundError(f"Model file not found at path: {model_path}")

    try:
        model = YOLO(model_path)
        # Detection 모델인지 검증
        if not (isinstance(model, YOLO_Model) and isinstance(model.model, DetectionModel)):
            raise TypeError(f"Invalid model type: {type(model)} (contained model type: {type(model.model)}). Expected a DetectionModel.")
        
        # gpu 이용
        if (device == "auto" and torch.cuda.is_available()):
            model.to("cuda")
            print('gpu 가속 활성화')
        elif (device == "auto"):
            model.to("cpu")
        else:
            model.to(device)
        return model
    except Exception as e:
        raise RuntimeError(f"Failed to load the model from {model_path}. Error: {str(e)}")
    