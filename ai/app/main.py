from fastapi import FastAPI, Request
from fastapi.exception_handlers import http_exception_handler, request_validation_exception_handler
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException
from api.yolo.detection import router as yolo_detection_router
from api.yolo.segmentation import router as yolo_segmentation_router
from api.yolo.classfication import router as yolo_classification_router
from api.yolo.model import router as yolo_model_router
from utils.slackMessage import send_slack_message

app = FastAPI()

# 각 기능별 라우터를 애플리케이션에 등록
app.include_router(yolo_detection_router, prefix="/api/detection", tags=["Detection"])
app.include_router(yolo_segmentation_router, prefix="/api/segmentation", tags=["Segmentation"])
app.include_router(yolo_classification_router, prefix="/api/classification", tags=["Classification"])
app.include_router(yolo_model_router, prefix="/api/model", tags=["Model"])


# 예외 처리기
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request:Request, exc):
    body = await request.json()
    send_slack_message(f"프로젝트 ID: {body['project_id']} - 실패! 에러: {str(exc)}", status="error")
    return await http_exception_handler(request, exc)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request:Request, exc):
    send_slack_message(f"{request.url} - 요청 실패! 에러: {str(exc)}", status="error")
    return await request_validation_exception_handler(request, exc)

# # 애플리케이션 실행
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", reload=True)
