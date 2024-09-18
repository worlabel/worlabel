from fastapi import APIRouter, HTTPException, File, UploadFile
from schemas.model_create_request import ModelCreateRequest
from services.create_model import create_new_model, upload_tmp_model
from services.load_model import load_model
from utils.file_utils import get_model_paths, delete_file, join_path, save_file, get_file_name
import re
from fastapi.responses import FileResponse

router = APIRouter()

# modelType(detection/segmentation/classification), (default, pretrained), labelCategories
@router.get("/info")
def get_model_info(model_path:str):
    try:
        model = load_model(model_path=model_path)
    except FileNotFoundError:
        raise HTTPException(status_code=404,
                        detail= "모델을 찾을 수 없습니다.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="model load exception: " + str(e))
    pretrained = model.names == {0: 'person', 1: 'bicycle', 2: 'car', 3: 'motorcycle', 4: 'airplane', 5: 'bus', 6: 'train', 7: 'truck', 8: 'boat', 9: 'traffic light', 10: 'fire hydrant', 11: 'stop sign', 12: 'parking meter', 13: 'bench', 14: 'bird', 15: 'cat', 16: 'dog', 17: 'horse', 18: 'sheep', 19: 'cow', 20: 'elephant', 21: 'bear', 22: 'zebra', 23: 'giraffe', 24: 'backpack', 25: 'umbrella', 26: 'handbag', 27: 'tie', 28: 'suitcase', 29: 'frisbee', 30: 'skis', 31: 'snowboard', 32: 'sports ball', 33: 'kite', 34: 'baseball bat', 35: 'baseball glove', 36: 'skateboard', 37: 'surfboard', 38: 'tennis racket', 39: 'bottle', 40: 'wine glass', 41: 'cup', 42: 'fork', 43: 'knife', 44: 'spoon', 45: 'bowl', 46: 'banana', 47: 'apple', 48: 'sandwich', 49: 'orange', 50: 'broccoli', 51: 'carrot', 52: 'hot dog', 53: 'pizza', 54: 'donut', 55: 'cake', 56: 'chair', 57: 'couch', 58: 'potted plant', 59: 'bed', 60: 'dining table', 61: 'toilet', 62: 'tv', 63: 'laptop', 64: 'mouse', 65: 'remote', 66: 'keyboard', 67: 'cell phone', 68: 'microwave', 69: 'oven', 70: 'toaster', 71: 'sink', 72: 'refrigerator', 73: 'book', 74: 'clock', 75: 'vase', 76: 'scissors', 77: 'teddy bear', 78: 'hair drier', 79: 'toothbrush'}

    return {"type": model.task, "pretrained":pretrained, "labelCategories":model.names}

# project_id => model path 리스트 를 가져오는 함수
@router.get("/list")
def get_model_list(project_id:int):
    try:
        return get_model_paths(project_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404,
                        detail= "프로젝트가 찾을 수 없거나 생성된 모델이 없습니다.")

@router.post("/create", status_code=201)
def create_model(request: ModelCreateRequest):
    if request.type not in ["seg", "det", "cls"]:
        raise HTTPException(status_code=400,
                             detail= f"Invalid type '{request.type}'. Must be one of \"seg\", \"det\", \"cls\".")
    model_path = create_new_model(request.project_id, request.type, request.pretrained)
    return {"model_path": model_path}

@router.delete("/delete", status_code=204)
def delete_model(model_path:str):
    pattern = r'^resources[/\\]projects[/\\](\d+)[/\\]models[/\\]([a-f0-9\-]+)\.pt$'
    if not re.match(pattern, model_path):
        raise HTTPException(status_code=400,
                            detail= "Invalid path format")
    try:
        delete_file(model_path)
    except FileNotFoundError:
        raise HTTPException(status_code=404,
                        detail= "모델을 찾을 수 없습니다.")

@router.post("/upload")
def upload_model(project_id:int, file: UploadFile = File(...)):
    # 확장자 확인
    if not file.filename.endswith(".pt"):
        raise HTTPException(status_code=400, detail="Only .pt files are allowed.")

    tmp_path = join_path("resources", "models", "tmp-"+file.filename)

    # 임시로 파일 저장
    try:
        save_file(tmp_path, file)
    except Exception as e:
        raise HTTPException(status_code=500, detail="file save exception: "+str(e))
    
    # YOLO 모델 변환 및 저장
    try:
        model_path = upload_tmp_model(project_id, tmp_path)
        return {"model_path": model_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail="file save exception: "+str(e))
    finally:
        # 임시파일 삭제
        delete_file(tmp_path)


@router.get("/download")
def download_model(model_path: str):
    pattern = r'^resources[/\\]projects[/\\](\d+)[/\\]models[/\\]([a-f0-9\-]+)\.pt$'
    if not re.match(pattern, model_path):
        raise HTTPException(status_code=400,
                            detail= "Invalid path format")
    try:
        filename = get_file_name(model_path)
        # 파일 응답 반환
        return FileResponse(model_path, media_type='application/octet-stream', filename=filename)
    except FileNotFoundError:
        raise HTTPException(status_code=404,
                        detail= "모델을 찾을 수 없습니다.")
