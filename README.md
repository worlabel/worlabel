
# 개발 기간
    - 2024/08/19(월) ~ 2024/10/11(금)
# 기술 스택
    
    FE: React, 주스텐드(Zustand)
    BE: Java, Springboot, JPA
    
    AI: FastAPI, ultralytics/yolov8
    
    DB: Mysql, Redis, Amazon S3, Firebase
    
    Infra: Docker, Jenkins, Amazon, GPU, Nginx
    
    Tool: Figma, Git, Github, Notion, Slack
    
# 프로젝트 소개

<aside>
💡

워라벨은 데이터 레이블링을 자동으로 진행해주는 서비스입니다. 이름은 “work-life-balance” 에서 유래되었습니다. 워라벨은 사용자가 work(데이터 레이블링) 에서 벗어나 시간을 절약하고 더 중요한 일이나 삶에 집중 할 수 있도록 합니다. 

</aside>

사용자가 수동 레이블링을 진행하고 이를 바탕으로 모델을 학습시킵니다. 이후 학습된 모델을 바탕으로 오토 레이블링을 진행하여 나온 결과를 바탕으로 다시 수동레이블링을 진행하고 다시 학습을 진행합니다. 이런 과정을 반복하여 적합한 모델을 만들고  사용할 수 있습니다. 

![1](https://github.com/user-attachments/assets/820f645f-8b6f-4a3f-88a5-d9b5ba6c6482)
<img width="790" alt="스크린샷 2024-10-13 오후 8 20 00" src="https://github.com/user-attachments/assets/7e9d86e9-eb10-4576-85a5-7d8e914e0744">



# 개선 사항

## AI 모델

학습 장수별 차이 비교 10 vs 100 vs 1000

## 10
<img width="1160" alt="스크린샷 2024-10-13 오후 8 21 14" src="https://github.com/user-attachments/assets/738d7aa8-32d8-4d46-ad46-32293c242f10">


## 100
<img width="1159" alt="스크린샷 2024-10-13 오후 8 21 21" src="https://github.com/user-attachments/assets/049a4ed5-b1e7-4d58-8f63-d960480d9860">


### 1000
<img width="1158" alt="스크린샷 2024-10-13 오후 8 21 28" src="https://github.com/user-attachments/assets/4d370043-77d3-4715-988d-e0c94b4c7dd9">

### 결과
![2](https://github.com/user-attachments/assets/24393e0e-6b47-4b61-8b56-c680996822fa)



## 백엔드

### 문제 상황

10000장의 이미지를 한 번에 업로드해야 했습니다. 처음에는 클라이언트에서 서버로 동기 방식으로 데이터를 전송했기 때문에 네트워크 부하가 발생했고, 대역폭 문제로 인해 업로드에 18분이나 걸렸습니다. 이로 인해 사용자는 느린 응답 시간을 경험하게 되어 서비스 성능에 문제가 있었습니다.

### 해결 방법

이 문제를 해결하기 위해 **Presigned URL** 방식을 적용하여 성능을 최적화했습니다. Presigned URL 방식을 통해 이미지를 직접 서버로 전송하는 대신, 메타데이터만 서버에 보내고 서버는 클라이언트에 적합한 업로드 링크를 비동기로 제공했습니다. 클라이언트는 이 링크를 통해 직접 이미지를 업로드하게 되어 네트워크 부하가 크게 줄었습니다.

- **네트워크 부하 감소**: 클라이언트와 서버 간의 데이터 전송량이 줄어들어 네트워크 부하를 줄임.
- **업로드 시간 단축**: 동기 방식에서 18분이 걸리던 업로드 시간을 1분 30초로 단축.
- **비동기 처리**: 클라이언트가 Presigned URL을 통해 직접 이미지를 업로드하게 하여 서버의 리소스 사용을 최적화.

### 적용 효과

Presigned URL을 적용한 후, 네트워크 부하가 크게 줄어들었고 업로드 시간이 1분 30초로 단축되었습니다. 이를 통해 사용자 경험이 개선되고 서비스의 성능이 향상되었습니다.

![3](https://github.com/user-attachments/assets/1ddb1281-439b-4abb-85dc-f3dacd184798)



## 프론트엔드

### 문제 상황

1000건 이상의 데이터를 페이지네이션 없이 테이블로 렌더링해야 했습니다. 특히 이미지가 포함된 데이터를 API에서 가져와 모두 한꺼번에 화면에 표시하려니 초기 로딩 시간이 길고, 이미지 리소스를 한 번에 요청하면서 성능 저하가 발생했습니다. 스크롤도 부드럽지 않아 사용자 경험에 부정적인 영향을 주었습니다.

### 해결 방법

이 문제를 해결하기 위해 react-window를 도입하여 성능을 최적화했습니다. react-window는 대량의 데이터를 효율적으로 렌더링할 수 있는 windowing 기법을 제공합니다. 이를 통해 전체 데이터를 한 번에 렌더링하는 대신, 화면에 보이는 데이터만 부분적으로 렌더링할 수 있었습니다. 이로 인해 다음과 같은 이점을 얻을 수 있었습니다.

- 부분 렌더링: 사용자가 보고 있는 영역에 해당하는 데이터만 렌더링하여 초기 로딩 시간을 크게 단축.
- 메모리 사용 절감: 렌더링되는 DOM 노드 수를 줄여 브라우저 메모리 사용량을 최적화.
- 이미지 로딩 최적화: 화면에 보이는 이미지들만 우선적으로 로딩하여 리소스 요청 수를 줄임.

### 적용 효과

react-window를 적용한 후 렌더링 시간이 크게 단축되었으며, 스크롤이 부드러워지고 브라우저 성능이 개선되었습니다. 특히 이미지가 포함된 데이터에 대해 불필요한 리소스 요청을 줄여 사용자 경험을 개선할 수 있었습니다.

ERD (Mysql)

![4](https://github.com/user-attachments/assets/19b6a2f8-480b-4b22-bb93-5a86a97cedcb)


개발 팀 소개
    - FE : 조현수, 정현조
    - BE : 김태수, 김용수
    - AI : 김진현
    - Infra : 홍창기

1. 화면 소개
    
8-1. 수동 세그멘테이션
    
  ![5](https://github.com/user-attachments/assets/76bb38dd-18dc-4ef3-9c95-f4ba20e39f8d)


8-2. 오토 세그멘테이션

8-3. 학습 과정

![6](https://github.com/user-attachments/assets/2ed5ad1e-bf6f-493a-bff4-78f14daedeae)


 

8-4. 학습된 모델의 결과확인
![7](https://github.com/user-attachments/assets/fe83b3a2-a2e4-4ff3-93e7-16cc3a480a1a)



