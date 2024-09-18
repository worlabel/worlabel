from pydantic import BaseModel

class ModelCreateRequest(BaseModel):
    project_id: int
    type: str
    pretrained:bool = True