from ultralytics import YOLO # Ultralytics YOLO 모델을 가져오기
import os
import uuid

def create_pretrained_model(project_id: id, type:str):
    suffix = ""
    if type in ["seg", "cls"]:
        suffix = "-"+type
    # 학습된 기본 모델 로드
    model = YOLO(os.path.join("resources", "models" ,f"yolov8n{suffix}.pt"))

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

    return model_path

def create_default_model(project_id: id, type:str, labels:list[str]):
    pass