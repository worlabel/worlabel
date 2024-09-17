from fastapi import APIRouter, HTTPException
from schemas.model_create_request import ModelCreateRequest
from services.init_model import create_pretrained_model, create_default_model

router = APIRouter()

# modelType(detection/segmentation/classification), (default, pretrained), labelCategories
@router.get("/info")
def get_model_info(project_id:int, model_path:str):
    pass

#
@router.get("/list")
def get_model_list(project_id:int):
    pass

@router.post("/create", status_code=201)
def model_create(request: ModelCreateRequest):
    if request.type not in ["seg", "det", "cls"]:
        raise HTTPException(status_code=400,
                             detail= f"Invalid type '{request.type}'. Must be one of \"seg\", \"det\", \"cls\".")
    if request.pretrained:
        model_path = create_pretrained_model(request.project_id, request.type)
    else:
        labels = list(map(lambda x:x.label, request.labelCategories))
        model_path = create_default_model(request.project_id, request.type, labels)
    return {"model_path": model_path}

@router.delete("/delete", status_code=204)
def model_delete():
    pass

@router.post("/upload")
def model_upload():
    pass

@router.get("/download")
def model_download():
    pass    
