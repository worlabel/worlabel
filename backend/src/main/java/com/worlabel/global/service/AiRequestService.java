package com.worlabel.global.service;

import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;
import java.util.function.Function;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiRequestService {

    private final RestTemplate restTemplate;
    /**
     * AI SERVER 주소
     */
    @Value("${ai.server}")
    private String aiServer;

    public <T, R> R postRequest(String endPoint, T requestData, Class<R> responseType, Function<String, R> converter) {
        String url = createApiUrl(endPoint);
        HttpEntity<T> request = new HttpEntity<>(requestData, createJsonHeaders());

        log.debug("요청 {}",url);
        // Void 타입의 경우 별도 처리 (상태 코드만 확인)
        if (responseType.equals(Void.class)) {
            sendVoidRequest(url, request);
            return null; // Void는 반환값이 없으므로 null 반환
        }

        // 응답이 있는 경우 처리
        String data = sendRequest(url, HttpMethod.POST, request);
        return converter.apply(data);  // 응답 데이터를 변환기 사용해 처리
    }

    public <R> R getRequest(String endPoint, Function<String, R> converter) {
        String url = createApiUrl(endPoint);
        HttpEntity<Void> request = new HttpEntity<>(createJsonHeaders());

        // 공통 메서드 사용
        String data = sendRequest(url, HttpMethod.GET, request);
        return converter.apply(data);
    }

    // 응답이 없는 요청인 경우 예 : 오토 레이블링 요청
    private <T> void sendVoidRequest(String url, HttpEntity<T> requestEntity) {
        try {
            ResponseEntity<Void> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Void.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new CustomException(ErrorCode.AI_SERVER_ERROR);
            }
        } catch (Exception e) {
            log.error("AI 서버 요청 중 오류 발생: {}", e.getMessage());
            throw new CustomException(ErrorCode.AI_SERVER_ERROR);
        }
    }

    private <T> String sendRequest(String url, HttpMethod method, HttpEntity<T> requestEntity) {
        try {
            ResponseEntity<String> response = restTemplate.exchange(url, method, requestEntity, String.class);
            return Optional.ofNullable(response.getBody())
                    .orElseThrow(() -> new CustomException(ErrorCode.AI_SERVER_ERROR));
        } catch (Exception e) {
            log.error("AI 서버 요청 중 오류 발생: {}", e.getMessage());
            throw new CustomException(ErrorCode.AI_SERVER_ERROR);
        }
    }

    /**
     * 요청 서버 설정
     */
    private String createApiUrl(String endPoint) {
        return aiServer + "/" + endPoint;
    }

    /**
     * 요청 헤더 설정
     */
    private HttpHeaders createJsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        return headers;
    }
}
