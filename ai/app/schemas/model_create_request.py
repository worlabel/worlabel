from pydantic import BaseModel

class ModelCreateRequest(BaseModel):
    project_type: str
    pretrained:bool = True