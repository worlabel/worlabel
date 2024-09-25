from schemas.train_report_data import ReportData
from dotenv import load_dotenv
import os, httpx


def send_data_call_api(project_id:int, model_id:int, data:ReportData, token):
    try:
        load_dotenv() 
        # main.py와 같은 디렉토리에 .env 파일 생성해서 따옴표 없이 입력
        # API_BASE_URL = {url}
        # API_KEY = {key}
        base_url = os.getenv("API_BASE_URL")
        headers = {
            "Content-Type": "application/json"
        }
        if token:
            headers["Authorization"] = f"Bearer {token}"

        response = httpx.request(
            method="POST",
            url=base_url+f"/api/projects/{project_id}/reports/models/{model_id}",
            json=data.model_dump(),
            headers=headers
        )
        # status에 따라 예외 발생
        response.raise_for_status()
    except Exception as e:
        print("report data failed: "+str(e))
