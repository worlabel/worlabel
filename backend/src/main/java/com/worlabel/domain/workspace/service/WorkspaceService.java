package com.worlabel.domain.workspace.service;

import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.member.repository.MemberRepository;
import com.worlabel.domain.participant.entity.WorkspaceParticipant;
import com.worlabel.domain.participant.repository.WorkspaceParticipantRepository;
import com.worlabel.domain.workspace.entity.Workspace;
import com.worlabel.domain.workspace.entity.dto.WorkspaceMemberResponse;
import com.worlabel.domain.workspace.entity.dto.WorkspaceRequest;
import com.worlabel.domain.workspace.entity.dto.WorkspaceResponse;
import com.worlabel.domain.workspace.repository.WorkspaceRepository;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final MemberRepository memberRepository;
    private final WorkspaceParticipantRepository workspaceParticipantRepository;

    /**
     * 새로운 워크스페이스 생성
     */
    public WorkspaceResponse createWorkspace(final Integer memberId, final WorkspaceRequest workspaceRequest) {
        Member member = getMember(memberId);
        Workspace workspace = Workspace.of(member, workspaceRequest.getTitle(), workspaceRequest.getContent());
        workspaceRepository.save(workspace);
        workspaceParticipantRepository.save(WorkspaceParticipant.of(workspace, member));

        return WorkspaceResponse.from(workspace);
    }

    /**
     * 특정 워크스페이스 조회
     */
    @Transactional(readOnly = true)
    public WorkspaceResponse getWorkspaceById(final Integer memberId, final Integer workspaceId) {
        checkWorkspaceAuthorized(memberId, workspaceId);

        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new CustomException(ErrorCode.WORKSPACE_NOT_FOUND));

        return WorkspaceResponse.from(workspace);
    }

    /**
     * 전체 워크스페이스 조회
     */
    @Transactional(readOnly = true)
    public List<WorkspaceResponse> getAllWorkspaces(final Integer memberId, final Integer lastWorkspaceId, final Integer pageSize) {
        return workspaceRepository.findWorkspacesByMemberIdWithPagination(memberId, lastWorkspaceId, pageSize).stream()
                .map(WorkspaceResponse::from)
                .toList();
    }

    /**
     * 워크스페이스 수정
     */
    public WorkspaceResponse updateWorkspace(final Integer memberId, final Integer workspaceId, final WorkspaceRequest updatedWorkspace) {
        Workspace workspace = getWorkspaceWithWriter(memberId, workspaceId);
        workspace.updateWorkspace(updatedWorkspace.getTitle(), updatedWorkspace.getContent());

        return WorkspaceResponse.from(workspace);
    }

    /**
     * 워크스페이스 삭제
     */
    public void deleteWorkspace(final Integer memberId, final Integer workspaceId) {
        Workspace workspace = getWorkspaceWithWriter(memberId, workspaceId);
        workspaceRepository.delete(workspace);
    }

    /**
     * 워크스페이스 멤버 추가 - 현재는 워크스페이스 만든 사람만 가능
     */
    public void addWorkspaceMember(final Integer memberId, final Integer workspaceId, final Integer newMemberId) {
        Workspace workspace = getWorkspaceWithWriter(memberId, workspaceId);
        checkExistWorkspaceMember(workspaceId, newMemberId);
        Member member = getMember(newMemberId);

        workspaceParticipantRepository.save(WorkspaceParticipant.of(workspace, member));
    }

    /**
     * 워크스페이스 멤버 삭제 - 현재는 워크스페이스 만든 사람만 가능
     */
    public void removeWorkspaceMember(final Integer memberId, final Integer workspaceId, final Integer newMemberId) {
        Workspace workspace = getWorkspaceWithWriter(memberId, workspaceId);
        WorkspaceParticipant workspaceParticipant = getWorkspaceParticipant(newMemberId, workspace);

        workspaceParticipantRepository.delete(workspaceParticipant);
    }

    /**
     * 워크스페이스 멤버 조회
     */
    public List<WorkspaceMemberResponse> getWorkspaceMember(final Integer memberId, Integer workspaceId) {
        checkWorkspaceAuthorized(memberId, workspaceId);

       return workspaceParticipantRepository.findAllByWorkspaceIdFetchJoin(workspaceId).stream()
               .map(WorkspaceMemberResponse::from)
               .toList();
    }

    private Member getMember(final Integer memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    /**
     * 작성자와 같은 워크스페이스만 가져옴
     * 기존 방식은 DB 2번 접근 -> 쿼리로 한번에 접근하도록 바꿈
     */
    private Workspace getWorkspaceWithWriter(final Integer memberId, final Integer workspaceId) {
        return workspaceRepository.findByMemberIdAndId(memberId, workspaceId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_AUTHOR));
    }

    private void checkWorkspaceAuthorized(final Integer memberId, final Integer workspaceId) {
        if (!workspaceParticipantRepository.existsByMemberIdAndWorkspaceId(memberId, workspaceId)) {
            throw new CustomException(ErrorCode.NOT_AUTHOR);
        }
    }

    private void checkExistWorkspaceMember(final Integer workspaceId, final Integer newMemberId) {
        if (workspaceParticipantRepository.existsByMemberIdAndWorkspaceId(newMemberId, workspaceId)) {
            throw new CustomException(ErrorCode.EARLY_ADD_MEMBER);
        }
    }

    private WorkspaceParticipant getWorkspaceParticipant(final Integer newMemberId, final Workspace workspace) {
        return workspaceParticipantRepository.findByMemberIdAndWorkspace(newMemberId, workspace)
                .orElseThrow(() -> new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED));
    }
}