from pydantic import BaseModel

class TrainResponse(BaseModel):
    modelKey:str
    precision: float
    recall: float
    mAP50: float
    mAP5095: float
    accuracy: float
    fitness: float