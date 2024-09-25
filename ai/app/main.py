from fastapi import FastAPI
from api.yolo.detection import router as yolo_detection_router
from api.yolo.segmentation import router as yolo_segmentation_router
from api.yolo.model import router as yolo_model_router

app = FastAPI()

# 각 기능별 라우터를 애플리케이션에 등록
app.include_router(yolo_detection_router, prefix="/api/detection", tags=["Detection"])
app.include_router(yolo_segmentation_router, prefix="/api/segmentation", tags=["Segmentation"])
app.include_router(yolo_model_router, prefix="/api/model", tags=["Model"])

# # 애플리케이션 실행
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", reload=True)
