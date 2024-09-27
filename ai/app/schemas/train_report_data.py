from pydantic import BaseModel

class ReportData(BaseModel):
    
    epoch: int          # 현재 에포크
    total_epochs: int   # 전체 에포크
    seg_loss: float     # seg_loss
    box_loss: float     # box loss
    cls_loss: float     # cls loss
    dfl_loss: float     # dfl loss
    fitness: float      # 적합도
    epoch_time: float   # 지난 에포크 걸린 시간 (에포크 시작 기준으로 결정)
    left_seconds: float # 남은 시간(초)