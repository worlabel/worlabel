package com.worlabel.domain.project.service;

import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.member.repository.MemberRepository;
import com.worlabel.domain.participant.entity.Participant;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.domain.participant.entity.WorkspaceParticipant;
import com.worlabel.domain.participant.entity.dto.ParticipantRequest;
import com.worlabel.domain.participant.repository.ParticipantRepository;
import com.worlabel.domain.participant.repository.WorkspaceParticipantRepository;
import com.worlabel.domain.project.dto.AutoLabelingImageRequest;
import com.worlabel.domain.project.dto.AutoLabelingRequest;
import com.worlabel.domain.project.dto.RequestDto.TrainRequest;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.entity.dto.ProjectMemberResponse;
import com.worlabel.domain.project.entity.dto.ProjectRequest;
import com.worlabel.domain.project.entity.dto.ProjectResponse;
import com.worlabel.domain.project.repository.ProjectRepository;
import com.worlabel.domain.workspace.entity.Workspace;
import com.worlabel.domain.workspace.repository.WorkspaceRepository;
import com.worlabel.global.annotation.CheckPrivilege;
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

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final WorkspaceRepository workspaceRepository;
    private final ParticipantRepository participantRepository;
    private final MemberRepository memberRepository;
    private final WorkspaceParticipantRepository workspaceParticipantRepository;
    private final RestTemplate restTemplate;
    private final ImageRepository imageRepository;

    /**
     * AI SERVER 주소
     */
    @Value("${ai.server}")
    private String aiServer;

    public ProjectResponse createProject(final Integer memberId, final Integer workspaceId, final ProjectRequest projectRequest) {
        Workspace workspace = getWorkspace(memberId, workspaceId);
        Member member = getMember(memberId);

        Project project = Project.of(projectRequest.getTitle(), workspace, projectRequest.getProjectType());
        Participant participant = Participant.of(project, member, PrivilegeType.ADMIN);

        projectRepository.save(project);
        participantRepository.save(participant);

        return ProjectResponse.from(project);
    }

    @Transactional(readOnly = true)
    @CheckPrivilege(PrivilegeType.VIEWER)
    public ProjectResponse getProjectById(final Integer memberId, final Integer projectId) {
        Project project = getProject(projectId);
        return ProjectResponse.from(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjectsByWorkspaceId(final Integer workspaceId, final Integer memberId, final Integer lastProjectId, final Integer pageSize) {
        return projectRepository.findProjectsByWorkspaceIdAndMemberIdWithPagination(workspaceId, memberId, lastProjectId, pageSize).stream()
            .map(ProjectResponse::from)
            .toList();
    }

    @CheckPrivilege(PrivilegeType.ADMIN)
    public ProjectResponse updateProject(final Integer memberId, final Integer projectId, final ProjectRequest projectRequest) {
        Project project = getProject(projectId);
        project.updateProject(projectRequest.getTitle(), projectRequest.getProjectType());

        return ProjectResponse.from(project);
    }

    @CheckPrivilege(PrivilegeType.ADMIN)
    public void deleteProject(final Integer memberId, final Integer projectId) {
        projectRepository.deleteById(projectId);
    }

    @CheckPrivilege(PrivilegeType.MANAGER)
    public List<ProjectMemberResponse> getProjectMember(final Integer memberId, final Integer projectId) {
        List<Participant> participants = participantRepository.findAllByProjectIdWithMember(projectId);

        return participants.stream()
            .map(ProjectMemberResponse::from)
            .toList();
    }

    @CheckPrivilege(PrivilegeType.ADMIN)
    public void addProjectMember(final Integer memberId, final Integer projectId, final ParticipantRequest participantRequest) {
        checkSelfParticipant(memberId, participantRequest.getMemberId());

        Project project = getProject(projectId);
        Member member = getMember(participantRequest.getMemberId());
        Participant participant = Participant.of(project, member, participantRequest.getPrivilegeType());

        if (!workspaceParticipantRepository.existsByMemberAndWorkspace(member, project.getWorkspace())) {
            workspaceParticipantRepository.save(WorkspaceParticipant.of(project.getWorkspace(), member));
        }

        participantRepository.save(participant);
    }

    @CheckPrivilege(PrivilegeType.ADMIN)
    public void changeProjectMember(final Integer memberId, final Integer projectId, final ParticipantRequest participantRequest) {
        checkNotAdminParticipant(participantRequest.getMemberId(), projectId);

        Participant participant = participantRepository.findByMemberIdAndProjectId(participantRequest.getMemberId(), projectId)
            .orElseThrow(() -> new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED));
        participant.updatePrivilege(participantRequest.getPrivilegeType());
    }

    @CheckPrivilege(PrivilegeType.ADMIN)
    public void removeProjectMember(final Integer memberId, final Integer projectId, final Integer removeMemberId) {
        checkNotAdminParticipant(removeMemberId, projectId);

        Participant participant = participantRepository.findByMemberIdAndProjectId(removeMemberId, projectId)
            .orElseThrow(() -> new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED));

        participantRepository.delete(participant);
    }

    @CheckPrivilege(PrivilegeType.EDITOR)
    public void train(final Integer memberId, final Integer projectId) {
        // TODO: 레디스 train 테이블에 존재하는지 확인 -> 이미 있으면 있다고 예외를 던져준다.
        /*
            없으면 redis 상태 테이블을 만든다. progressTable
         */

        // FastAPI 서버로 학습 요청을 전송
        String url = aiServer + "/detection/train";

        TrainRequest trainRequest = new TrainRequest();
        trainRequest.setProjectId(projectId);
        trainRequest.setData(List.of());

        // FastAPI 서버로 POST 요청 전송
        try {
            ResponseEntity<String> result = restTemplate.postForEntity(url, trainRequest, String.class);
            log.debug("응답 결과 {} ", result);
            log.debug("FastAPI 서버에 학습 요청을 성공적으로 전송했습니다. Project ID: {}", projectId);
        } catch (Exception e) {
            log.error("FastAPI 서버에 학습 요청을 전송하는 중 오류가 발생했습니다 {}", e.getMessage());
            throw new CustomException(ErrorCode.AI_SERVER_ERROR);
        }
    }

    public Project getProject(final Integer projectId) {
        return projectRepository.findById(projectId)
            .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));
    }

    private Workspace getWorkspace(final Integer memberId, final Integer workspaceId) {
        return workspaceRepository.findByMemberIdAndId(memberId, workspaceId)
            .orElseThrow(() -> new CustomException(ErrorCode.WORKSPACE_NOT_FOUND));
    }

    private Member getMember(final Integer memberId) {
        return memberRepository.findById(memberId)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    private void checkNotAdminParticipant(final Integer memberId, final Integer projectId) {
        checkSelfParticipant(memberId, projectId);
        if (participantRepository.existsByProjectIdAndMemberIdAndPrivilege(projectId, memberId, PrivilegeType.ADMIN)) {
            throw new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED);
        }
    }

    private void checkSelfParticipant(final Integer memberId, final Integer addMemberId) {
        if (Objects.equals(memberId, addMemberId)) {
            throw new CustomException(ErrorCode.PARTICIPANT_BAD_REQUEST);
        }
    }

    /**
     * 프로젝트별 오토 레이블링
     */
    @CheckPrivilege(PrivilegeType.EDITOR)
    public void autoLabeling(final Integer memberId, final Integer projectId) {
        Project project = getProject(projectId);
        log.debug("{}번 프로젝트 이미지 {} 진행", projectId, project.getProjectType());

        List<Image> imageList = imageRepository.findImagesByProjectId(projectId);
        List<AutoLabelingImageRequest> imageRequestList = imageList.stream()
            .map(AutoLabelingImageRequest::of)
            .toList();
        AutoLabelingRequest autoLabelingRequest = AutoLabelingRequest.of(projectId, imageRequestList);
        sendRequestToApi(autoLabelingRequest, project);
    }

    private void sendRequestToApi(AutoLabelingRequest autoLabelingRequest, Project project) {
        String url = createApiUrl("/auto" + project.getProjectType());

        HttpHeaders headers = createJsonHeaders();

        // 요청 본문 설정
        HttpEntity<AutoLabelingRequest> request = new HttpEntity<>(autoLabelingRequest, headers);

        try {
            log.debug("요청 서버 : {}", url);
            // AI 서버로 POST 요청
            ResponseEntity<String> response = restTemplate.exchange(url, // 요청을 보낼 URL
                HttpMethod.POST, // HTTP 메서드 (POST)
                request, // HTTP 요청 본문과 헤더가 포함된 객체
                String.class // 응답을 String 타입으로
            );
            String responseBody = Optional.ofNullable(response.getBody())
                .orElseThrow(() -> new CustomException(ErrorCode.AI_SERVER_ERROR));
        } catch (Exception e) {
            log.error("AI 서버 요청 중 오류 발생: ", e);
            throw new CustomException(ErrorCode.AI_SERVER_ERROR);
        }
    }

    /**
     * 요청 헤더 설정
     */
    private HttpHeaders createJsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        return headers;
    }


    /**
     * API URL 구성
     */
    private String createApiUrl(String endPoint) {
        return aiServer + "/" + endPoint;
    }
}

