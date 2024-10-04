from fastapi import APIRouter, HTTPException, File, UploadFile
from schemas.model_create_request import ModelCreateRequest
from services.create_model import create_new_model, save_model
from services.load_model import load_model
from utils.file_utils import get_model_keys, delete_file, join_path, save_file, get_file_name
import re
from fastapi.responses import FileResponse

router = APIRouter()

@router.get("/info/projects/{project_id}/models/{model_key}", summary= "모델 관련 정보 반환")
def get_model_info(project_id:int, model_key:str):
    model_path = join_path("resources","projects", str(project_id), "models", model_key)
    try:
        model = load_model(model_path=model_path)
    except FileNotFoundError:
        raise HTTPException(status_code=404,
                        detail= "모델을 찾을 수 없습니다.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="model load exception: " + str(e))
    # TODO: 학습치 등등 추가 예정
    return {"type": model.task, "labelCategories":model.names}

# project_id => model path 리스트 를 가져오는 함수
@router.get("/projects/{project_id}", summary="project id 에 해당하는 모델 id 리스트")
def get_model_list(project_id:int):
    try:
        return get_model_keys(project_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404,
                        detail= "프로젝트가 찾을 수 없거나 생성된 모델이 없습니다.")

@router.post("/projects/{project_id}", status_code=201)
def create_model(project_id: int, request: ModelCreateRequest):
    model_key = create_new_model(project_id, request.project_type, request.pretrained)
    return {"model_key": model_key}

@router.delete("/projects/{project_id}/models/{model_key}", status_code=204)
def delete_model(project_id:int, model_key:str):
    model_path = join_path("resources", "projects", str(project_id), "models", model_key)
    try:
        delete_file(model_path)
    except FileNotFoundError:
        raise HTTPException(status_code=404,
                        detail= "모델을 찾을 수 없습니다.")

@router.post("/upload/projects/{project_id}")
def upload_model(project_id:int, file: UploadFile = File(...)):
    # 확장자 확인 확장자 새로 추가한다면 여기에 추가
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
        model_path = save_model(project_id, tmp_path)
        return {"model_path": model_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail="file save exception: "+str(e))
    finally:
        # 임시파일 삭제
        delete_file(tmp_path)


@router.get("/download/projects/{project_id}/models/{model_key}")
def download_model(project_id:int, model_key:str):
    model_path = join_path("resources", "projects", str(project_id), "models", model_key)
    try:
        filename = get_file_name(model_path)
        # 파일 응답 반환
        return FileResponse(model_path, media_type='application/octet-stream', filename=filename)
    except FileNotFoundError:
        raise HTTPException(status_code=404,
                        detail= "모델을 찾을 수 없습니다.")
