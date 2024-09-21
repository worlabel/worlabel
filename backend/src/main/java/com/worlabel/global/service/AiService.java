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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AiService {

    private final RestTemplate restTemplate;
    /**
     * AI SERVER 주소
     */
    @Value("${ai.server}")
    private String aiServer;

    public <T,R> R postRequest(String endPoint, T requestData, Class<R> responseType) {
        String url = createApiUrl(endPoint);
        HttpHeaders headers = createJsonHeaders();
        HttpEntity<T> request = new HttpEntity<>(requestData, headers);

        try {
            ResponseEntity<R> response = restTemplate.exchange(url, HttpMethod.POST, request, responseType);
            R retData = Optional.ofNullable(response.getBody())
                    .orElseThrow(() -> new CustomException(ErrorCode.AI_SERVER_ERROR));
            log.debug("ret Data: {}", retData);
            return retData;
        } catch (Exception e) {
            log.error("FastAPI 서버 학습 요청 중 오류 발생 {}", e.getMessage());
            throw new CustomException(ErrorCode.AI_SERVER_ERROR);
        }
    }

    public <R> R getRequest(String endPoint, Class<R> responseType) {
        String url = createApiUrl(endPoint);
        HttpHeaders headers = createJsonHeaders();
        HttpEntity<R> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<R> response = restTemplate.exchange(url, HttpMethod.GET, request, responseType);
            R retData = Optional.ofNullable(response.getBody())
                    .orElseThrow(() -> new CustomException(ErrorCode.AI_SERVER_ERROR));
            log.debug("ret Data: {}", retData);
            return retData;
        } catch (Exception e) {
            log.error("FastAPI 서버 학습 요청 중 오류 발생 {}", e.getMessage());
            throw new CustomException(ErrorCode.AI_SERVER_ERROR);
        }
    }

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
