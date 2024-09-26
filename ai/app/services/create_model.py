from ultralytics import YOLO # Ultralytics YOLO 모델을 가져오기
import os
import uuid
from services.load_model import load_model

def create_new_model(project_id: int, type:str, pretrained:bool):
    suffix = ""
    type_list = {"segmentation": "seg", "classification": "cls"}
    if type in type_list:
        suffix = "-"+type_list[type]
    # 학습된 기본 모델 로드
    if pretrained:
        suffix += ".pt"
    else:
        suffix += ".yaml"
    model = YOLO(os.path.join("resources", "models" ,f"yolov8n{suffix}"))

    # 모델을 저장할 폴더 경로
    base_path = os.path.join("resources","projects",str(project_id),"models")
    os.makedirs(base_path, exist_ok=True)

    # 고유값 id 생성
    unique_id = uuid.uuid4()
    while os.path.exists(os.path.join(base_path, f"{unique_id}.pt")):
        unique_id = uuid.uuid4()
    model_path = os.path.join(base_path, f"{unique_id}.pt")

    # 기본 모델 저장
    model.save(filename=model_path)

    return f"{unique_id}.pt"

def save_model(project_id: int, path:str):
    # 모델 불러오기
    model = load_model(path)

    # 모델을 저장할 폴더 경로
    base_path = os.path.join("resources","projects",str(project_id),"models")
    os.makedirs(base_path, exist_ok=True)

    # 고유값 id 생성
    unique_id = uuid.uuid4()
    while os.path.exists(os.path.join(base_path, f"{unique_id}.pt")):
        unique_id = uuid.uuid4()
    model_path = os.path.join(base_path, f"{unique_id}.pt")

    # 기본 모델 저장
    model.save(filename=model_path)

    return f"{unique_id}.pt"
    