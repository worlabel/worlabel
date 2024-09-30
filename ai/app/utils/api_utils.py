from schemas.train_report_data import ReportData
from dotenv import load_dotenv
import os, httpx


def send_data_call_api(project_id:int, model_id:int, data:ReportData):
    try:
        load_dotenv() 
        base_url = os.getenv("API_BASE_URL")
        # main.py와 같은 디렉토리에 .env 파일 생성해서 따옴표 없이 아래 데이터를 입력
        # API_BASE_URL = {url}
        # API_KEY = {key}

        # 하드코딩으로 대체
        if not base_url:
            base_url = "http://127.0.0.1:8080"
        
        headers = {
            "Content-Type": "application/json"
        }

        response = httpx.request(
            method="POST",
            url=base_url+f"/api/projects/{project_id}/reports/models/{model_id}",
            json=data.model_dump(),
            headers=headers,
            timeout=10
        )
        # status에 따라 예외 발생
        response.raise_for_status()
    except Exception as e:
        print("report data failed: "+str(e))
