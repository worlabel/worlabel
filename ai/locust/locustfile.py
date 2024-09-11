from locust import HttpUser, TaskSet, task, between

class AIBehavior(TaskSet):
    @task(weight = 1) # weight: 해당 task의 빈도수
    def predict(self):
        data = {
            "project_id": 0,
            "image_list": [
                {
                    "image_id": 12,
                    "image_url": "test-data/images/image_000000001_jpg.rf.02ab6664294833e5f0e89130ecded0b8.jpg"
                },
                {
                    "image_id": 23,
                    "image_url": "test-data/images/image_000000002_jpg.rf.8270179e3cd29b97cf502622b381861e.jpg"
                },
                {
                    "image_id": 47,
                    "image_url": "test-data/images/image_000000003_jpg.rf.db8fd4730b031e35a60e0a60e17a0691.jpg"
                }
            ]
        }
        self.client.post("/api/detection", json=data)

    # 앞으로 다른 API 또는 다른 data에 대해서 task 추가 가능

class MyLocustUser(HttpUser):
    wait_time = between(1,3)
    tasks = [AIBehavior.predict]
    host = "http://127.0.0.1:8000"

# shell에 아래 명령어를 입력하여 실행(ai폴더 기준)
# locust -f locust/locustfile.py
# 또는
# cd locust
# locust