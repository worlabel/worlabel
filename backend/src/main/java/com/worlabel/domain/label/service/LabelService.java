package com.worlabel.domain.label.service;

import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.domain.label.entity.dto.AutoLabelingResponse;
import com.worlabel.domain.label.entity.dto.ImageRequest;
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
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LabelService {

    private final ParticipantRepository participantRepository;
    private final RestTemplateBuilder restTemplateBuilder;
    private final ProjectRepository projectRepository;
    private final S3UploadService s3UploadService;
    private final ImageRepository imageRepository;

    /**
     * AI SERVER 주소
     */
    @Value("${ai.server}")
    private String aiServer;

    public void autoLabeling(final Integer projectId, final Integer memberId) {
        checkEditorExistParticipant(memberId, projectId);

        ProjectType projectType = getType(projectId);
        List<ImageRequest> imageRequestList = getImageRequestList(projectId, projectType);

        List<AutoLabelingResponse> autoLabelingResponseList = sendRequestToApi(imageRequestList, projectType.getValue(), projectId);
    }

    private List<AutoLabelingResponse> sendRequestToApi(List<ImageRequest> imageRequestList, String apiEndpoint, int projectId) {
        String url = aiServer + "/" + apiEndpoint;
        // 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        // 요청 본문 설정
        HttpEntity<List<ImageRequest>> request = new HttpEntity<>(imageRequestList, headers);

        // RestTemplate을 동적으로 생성하여 사용
        RestTemplate restTemplate = restTemplateBuilder.build();
        try {
            // AI 서버로 POST 요청
            // TODO: 응답 추후 교체
            ResponseEntity<List<AutoLabelingResponse>> response = restTemplate.exchange(
                    url, // 요청을 보낼 URL
                    HttpMethod.POST, // HTTP 메서드 (POST)
                    request, // HTTP 요청 본문과 헤더가 포함된 객체
                    new ParameterizedTypeReference<List<AutoLabelingResponse>>() {
                    } // 응답 타입을 지정
            );

            log.info("AI 서버 응답 -> {}", response.getBody());
            // JSON 응답을 S3에 업로드
            if(response.getBody() == null) {
                throw new CustomException(ErrorCode.AI_SERVER_ERROR);
            }
//            if (response.getBody() != null) {
//                for (AutoLabelingResponse autoLabelingResponse : response.getBody()) {
//                    String imageId = autoLabelingResponse.getImage_id();
//                    String jsonData = autoLabelingResponse.getData();
//                    String title = autoLabelingResponse.getTitle();
//                    if (imageId != null && jsonData != null) {
//                        // TODO: 잘 받아온다면 s3에 업로드
//                        log.debug("구현 무리없이 잘 된 경우 :{}", autoLabelingResponse);
////                        String jsonUrl = s3UploadService.uploadJson(jsonData, title, projectId);
////                        DB에 저장해야한다. -> 레이블이 있다면 저장 없다면 생성 해야한다.
//                    }
//                }
//                // 이 곳에서 리턴 후 다른 곳에서 넣는게 코드가 더 깔끔해질 것 같다.
                return response.getBody();
//            }
        } catch (Exception e) {
            log.error("AI 서버 요청 중 오류 발생: ", e);
            throw new CustomException(ErrorCode.AI_SERVER_ERROR);
        }
    }

    // TODO: N + 1문제 발생 추후 리팩토링해야합니다.
    private List<ImageRequest> getImageRequestList(Integer projectId, ProjectType projectType) {
        return imageRepository.findImagesByProjectId(projectId)
                .stream().map(o -> ImageRequest.of(o, projectType)).toList();
    }

    private ProjectType getType(final Integer projectId) {
        return projectRepository.findProjectTypeById(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));
    }

    private void checkEditorExistParticipant(final Integer memberId, final Integer projectId) {
        if (participantRepository.doesParticipantUnauthorizedExistByMemberIdAndProjectId(memberId, projectId)) {
            throw new CustomException(ErrorCode.PARTICIPANT_UNAUTHORIZED);
        }
    }

    public void save(final Integer imageId) {
    }
}
