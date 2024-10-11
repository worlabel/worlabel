import httpx
import os

SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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"

def send_slack_message(message: str, status: str = "info"):
    headers = {"Content-Type": "application/json"}

    # 상태에 따라 다른 메시지 형식 적용 (성공, 에러)
    if status == "error":
        formatted_message = f":x: 에러 발생: {message}"
    elif status == "success":
        formatted_message = f":white_check_mark: {message}"
    else:
        formatted_message = message

    # Slack에 전송할 페이로드
    payload = {
        "text": formatted_message
    }

    response = httpx.post(SLACK_WEBHOOK_URL, json=payload, headers=headers)

    if response.status_code == 200:
        return "Message sent successfully"
    else:
        return f"Failed to send message. Status code: {response.status_code}"
