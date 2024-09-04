package com.worlabel.domain.label.service;

import com.google.gson.*;
import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.domain.label.entity.Label;
import com.worlabel.domain.label.entity.dto.AutoLabelingRequest;
import com.worlabel.domain.label.entity.dto.AutoLabelingResponse;
import com.worlabel.domain.label.entity.dto.ImageRequest;
import com.worlabel.domain.label.repository.LabelRepository;
import com.worlabel.domain.participant.repository.ParticipantRepository;
import com.worlabel.domain.project.entity.ProjectType;
import com.worlabel.domain.project.repository.ProjectRepository;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.service.S3UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class LabelService {

    private final ParticipantRepository participantRepository;
    private final ProjectRepository projectRepository;
    private final LabelRepository labelRepository;
    private final S3UploadService s3UploadService;
    private final ImageRepository imageRepository;
    private final RestTemplate restTemplate;
    private final Gson gson;

    /**
     * AI SERVER 주소
     */
    @Value("${ai.server}")
    private String aiServer;

    public void autoLabeling(final Integer projectId, final Integer memberId) {
        checkEditorExistParticipant(memberId, projectId);

        ProjectType projectType = getType(projectId);
        log.debug("{}번 프로젝트 이미지 {} 진행 ", projectId, projectType);

        List<Image> imageList = imageRepository.findImagesByProjectId(projectId);
        List<ImageRequest> imageRequestList = imageList.stream().map(ImageRequest::of).toList();
        AutoLabelingRequest autoLabelingRequest = AutoLabelingRequest.of(projectId, imageRequestList);

        List<AutoLabelingResponse> autoLabelingResponseList = sendRequestToApi(autoLabelingRequest, projectType.getValue(), projectId);
        for (int index = 0; index < autoLabelingResponseList.size(); index++) {
            AutoLabelingResponse response = autoLabelingResponseList.get(index);
            Image image = imageList.get(index);
            String uploadedUrl = s3UploadService.uploadJson(response.getData(), response.getImageUrl());

            Label label = labelRepository.findByImageId(response.getImageId())
                    .orElseGet(() -> Label.of(uploadedUrl, image));
            labelRepository.save(label);
        }
    }

    private List<AutoLabelingResponse> sendRequestToApi(AutoLabelingRequest autoLabelingRequest, String apiEndpoint, int projectId) {
        String url = createApiUrl(apiEndpoint);

        // RestTemplate을 동적으로 생성하여 사용
        HttpHeaders headers = createJsonHeaders();

        // 요청 본문 설정
        HttpEntity<AutoLabelingRequest> request = new HttpEntity<>(autoLabelingRequest, headers);

        try {
            log.debug("요청 서버 : {}", url);
            // AI 서버로 POST 요청
            ResponseEntity<String> response = restTemplate.exchange(
                    url, // 요청을 보낼 URL
                    HttpMethod.POST, // HTTP 메서드 (POST)
                    request, // HTTP 요청 본문과 헤더가 포함된 객체
                    String.class // 응답을 String 타입으로
            );

            String responseBody = Optional.ofNullable(response.getBody())
                    .orElseThrow(() -> new CustomException(ErrorCode.AI_SERVER_ERROR));

            log.info("AI 서버 응답 -> {}", response.getBody());

            return parseAutoLabelingResponseList(responseBody);
        } catch (Exception e) {
            log.error("AI 서버 요청 중 오류 발생: ", e);
            throw new CustomException(ErrorCode.AI_SERVER_ERROR);
        }
    }

    private List<AutoLabelingResponse> parseAutoLabelingResponseList(String responseBody) {
        JsonElement jsonElement = JsonParser.parseString(responseBody);
        List<AutoLabelingResponse> autoLabelingResponseList = new ArrayList<>();
        for (JsonElement element : jsonElement.getAsJsonArray()) {
            AutoLabelingResponse response = parseAutoLabelingResponse(element);
            autoLabelingResponseList.add(response);
        }
        return autoLabelingResponseList;
    }

    /**
     * jsonElement -> AutoLabelingResponse
     */
    private AutoLabelingResponse parseAutoLabelingResponse(JsonElement element) {
        JsonObject jsonObject = element.getAsJsonObject();
        Long imageId = jsonObject.get("image_id").getAsLong();
        String imageUrl = jsonObject.get("image_url").getAsString();
        JsonObject data = jsonObject.get("data").getAsJsonObject();
        return AutoLabelingResponse.of(imageId, imageUrl, gson.toJson(data));
    }


    /**
     * API URL 구성
     */
    private String createApiUrl(String endPoint) {
        return aiServer + "/" + endPoint;
    }

    /**
     * 요청 헤더 설정
     */
    private static HttpHeaders createJsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        return headers;
    }

    /**
     * 프로젝트 타입 조회
     */
    private ProjectType getType(final Integer projectId) {
        return projectRepository.findProjectTypeById(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));
    }

    /**
     * 참여자(EDITOR, ADMIN) 검증 메서드
     */
    private void checkEditorExistParticipant(final Integer memberId, final Integer projectId) {
        if (participantRepository.doesParticipantUnauthorizedExistByMemberIdAndProjectId(memberId, projectId)) {
            throw new CustomException(ErrorCode.PARTICIPANT_UNAUTHORIZED);
        }
    }

    // TODO : 구현
    public void save(final Integer imageId) {
    }
}
