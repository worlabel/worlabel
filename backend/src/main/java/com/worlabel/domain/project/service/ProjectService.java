package com.worlabel.domain.project.service;

import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.member.repository.MemberRepository;
import com.worlabel.domain.participant.entity.Participant;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.domain.participant.entity.WorkspaceParticipant;
import com.worlabel.domain.participant.entity.dto.ParticipantRequest;
import com.worlabel.domain.participant.repository.ParticipantRepository;
import com.worlabel.domain.participant.repository.WorkspaceParticipantRepository;
import com.worlabel.domain.project.dto.RequestDto.TrainRequest;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.entity.dto.ProjectRequest;
import com.worlabel.domain.project.entity.dto.ProjectResponse;
import com.worlabel.domain.project.repository.ProjectRepository;
import com.worlabel.domain.workspace.entity.Workspace;
import com.worlabel.domain.workspace.repository.WorkspaceRepository;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Objects;

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
    public ProjectResponse getProjectById(final Integer memberId, final Integer projectId) {
        checkExistParticipant(memberId, projectId);
        Project project = getProject(projectId);

        return ProjectResponse.from(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjectsByWorkspaceId(final Integer workspaceId, final Integer memberId, final Integer lastProjectId, final Integer pageSize) {
        return projectRepository.findProjectsByWorkspaceIdAndMemberIdWithPagination(workspaceId, memberId, lastProjectId, pageSize).stream()
                .map(ProjectResponse::from)
                .toList();
    }

    public ProjectResponse updateProject(final Integer memberId, final Integer projectId, final ProjectRequest projectRequest) {
        checkAdminParticipant(memberId, projectId);
        Project project = getProject(projectId);
        project.updateProject(projectRequest.getTitle(), projectRequest.getProjectType());

        return ProjectResponse.from(project);
    }

    public void deleteProject(final Integer memberId, final Integer projectId) {
        checkAdminParticipant(memberId, projectId);
        projectRepository.deleteById(projectId);
    }

    public void addProjectMember(final Integer memberId, final Integer projectId, final ParticipantRequest participantRequest) {
        checkSelfParticipant(memberId, participantRequest.getMemberId());
        checkAdminParticipant(memberId, projectId);
        Project project = getProject(projectId);
        Member member = getMember(participantRequest.getMemberId());
        Participant participant = Participant.of(project, member, participantRequest.getPrivilegeType());

        if (!workspaceParticipantRepository.existsByMemberAndWorkspace(member, project.getWorkspace())) {
            workspaceParticipantRepository.save(WorkspaceParticipant.of(project.getWorkspace(), member));
        }

        participantRepository.save(participant);
    }

    public void changeProjectMember(final Integer memberId, final Integer projectId, final ParticipantRequest participantRequest) {
        checkSelfParticipant(memberId, participantRequest.getMemberId());
        checkAdminParticipant(memberId, projectId);
        checkNotAdminParticipant(participantRequest.getMemberId(), projectId);

        Participant participant = participantRepository.findByMemberIdAndProjectId(participantRequest.getMemberId(), projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED));
        participant.updatePrivilege(participantRequest.getPrivilegeType());
    }

    public void removeProjectMember(final Integer memberId, final Integer projectId, final Integer removeMemberId) {
        checkSelfParticipant(memberId, removeMemberId);
        checkAdminParticipant(memberId, projectId);
        checkNotAdminParticipant(removeMemberId, projectId);

        Participant participant = participantRepository.findByMemberIdAndProjectId(removeMemberId, projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED));

        participantRepository.delete(participant);
    }

    public void train(final Integer memberId, final Integer projectId) {
        // 멤버 권한 체크
        checkEditorParticipant(memberId, projectId);

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
            log.debug("응답 결과 {} ",result);
            log.debug("FastAPI 서버에 학습 요청을 성공적으로 전송했습니다. Project ID: {}", projectId);
        } catch (Exception e) {
            log.error("FastAPI 서버에 학습 요청을 전송하는 중 오류가 발생했습니다 {}",e.getMessage());
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

    private void checkEditorParticipant(final Integer memberId, final Integer projectId) {
        if(participantRepository.doesParticipantUnauthorizedExistByMemberIdAndProjectId(memberId,projectId)){
            throw new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED);
        }
    }

    private void checkExistParticipant(final Integer memberId, final Integer projectId) {
        if (!participantRepository.existsByMemberIdAndProjectId(memberId, projectId)) {
            throw new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED);
        }
    }

    private void checkAdminParticipant(final Integer memberId, final Integer projectId) {
        if (!participantRepository.existsByProjectIdAndMemberIdAndPrivilege(projectId, memberId, PrivilegeType.ADMIN)) {
            throw new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED);
        }
    }

    private void checkNotAdminParticipant(final Integer memberId, final Integer projectId) {
        if (participantRepository.existsByProjectIdAndMemberIdAndPrivilege(projectId, memberId, PrivilegeType.ADMIN)) {
            throw new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED);
        }
    }

    private void checkSelfParticipant(final Integer memberId, final Integer addMemberId) {
        if (Objects.equals(memberId, addMemberId)) {
            throw new CustomException(ErrorCode.PARTICIPANT_BAD_REQUEST);
        }
    }

}

