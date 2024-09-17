from fastapi import APIRouter, HTTPException
from schemas.model_create_request import ModelCreateRequest
from services.init_model import create_pretrained_model, create_default_model
from services.load_model import load_model

router = APIRouter()

# modelType(detection/segmentation/classification), (default, pretrained), labelCategories
@router.get("/info")
def get_model_info(model_path:str):
    try:
        model = load_model(model_path=model_path)
    except FileNotFoundError:
        HTTPException(status_code=404,
                        detail= f"Cannot found model")
    except Exception as e:
        raise HTTPException(status_code=500, detail="model load exception: " + str(e))
    pretrained = model.names == {0: 'person', 1: 'bicycle', 2: 'car', 3: 'motorcycle', 4: 'airplane', 5: 'bus', 6: 'train', 7: 'truck', 8: 'boat', 9: 'traffic light', 10: 'fire hydrant', 11: 'stop sign', 12: 'parking meter', 13: 'bench', 14: 'bird', 15: 'cat', 16: 'dog', 17: 'horse', 18: 'sheep', 19: 'cow', 20: 'elephant', 21: 'bear', 22: 'zebra', 23: 'giraffe', 24: 'backpack', 25: 'umbrella', 26: 'handbag', 27: 'tie', 28: 'suitcase', 29: 'frisbee', 30: 'skis', 31: 'snowboard', 32: 'sports ball', 33: 'kite', 34: 'baseball bat', 35: 'baseball glove', 36: 'skateboard', 37: 'surfboard', 38: 'tennis racket', 39: 'bottle', 40: 'wine glass', 41: 'cup', 42: 'fork', 43: 'knife', 44: 'spoon', 45: 'bowl', 46: 'banana', 47: 'apple', 48: 'sandwich', 49: 'orange', 50: 'broccoli', 51: 'carrot', 52: 'hot dog', 53: 'pizza', 54: 'donut', 55: 'cake', 56: 'chair', 57: 'couch', 58: 'potted plant', 59: 'bed', 60: 'dining table', 61: 'toilet', 62: 'tv', 63: 'laptop', 64: 'mouse', 65: 'remote', 66: 'keyboard', 67: 'cell phone', 68: 'microwave', 69: 'oven', 70: 'toaster', 71: 'sink', 72: 'refrigerator', 73: 'book', 74: 'clock', 75: 'vase', 76: 'scissors', 77: 'teddy bear', 78: 'hair drier', 79: 'toothbrush'}

    return {"type": model.task, "pretrained":pretrained, "labelCategories":model.names}

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
