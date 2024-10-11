# ai_service.py

from ultralytics import YOLO # Ultralytics YOLO 모델을 가져오기
import os
import torch

def load_detection_model(project_id:int, model_key:str):
    default_model_map = {"yolo8": os.path.join("resources","models","yolov8n.pt")}
    # 디폴트 모델 확인
    if model_key in default_model_map:
        model = YOLO(default_model_map[model_key])
    else:
        model = load_model(model_path=os.path.join("resources", "projects",str(project_id),"models", model_key))

    # Detection 모델인지 검증
    if model.task != "detect":
        raise TypeError(f"Invalid model type: {model.task}. Expected a DetectionModel.")
    return model
    
def load_segmentation_model(project_id:int, model_key:str): 
    default_model_map = {"yolo8": os.path.join("resources","models","yolov8n-seg.pt")}
    # 디폴트 모델 확인
    if model_key in default_model_map:
        model = YOLO(default_model_map[model_key])
    else:
        model = load_model(model_path=os.path.join("resources", "projects",str(project_id),"models",model_key))
        
    # Segmentation 모델인지 검증
    if model.task != "segment":
        raise TypeError(f"Invalid model type: {model.task}. Expected a SegmentationModel.")
    return model

def load_classification_model(project_id:int, model_key:str):
    default_model_map = {"yolo8": os.path.join("resources","models","yolov8n-cls.pt")}
    # 디폴트 모델 확인
    if model_key in default_model_map:
        model = YOLO(default_model_map[model_key])
    else:
        model = load_model(model_path=os.path.join("resources", "projects",str(project_id),"models",model_key))
        
    # Segmentation 모델인지 검증
    if model.task != "classify":
        raise TypeError(f"Invalid model type: {model.task}. Expected a ClassificationModel.")
    return model

def load_model(model_path: str):
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
