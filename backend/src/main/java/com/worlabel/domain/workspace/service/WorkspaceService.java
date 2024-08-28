package com.worlabel.domain.workspace.service;

import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.member.repository.MemberRepository;
import com.worlabel.domain.workspace.entity.Workspace;
import com.worlabel.domain.workspace.entity.dto.WorkspaceRequest;
import com.worlabel.domain.workspace.entity.dto.WorkspaceResponse;
import com.worlabel.domain.workspace.repository.WorkspaceRepository;
import com.worlabel.global.annotation.CurrentUser;
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

    /**
     * 새로운 워크스페이스 생성
     */
    public WorkspaceResponse createWorkspace(final Integer memberId, final WorkspaceRequest workspaceRequest) {
        Member member = getMember(memberId);
        Workspace workspace = Workspace.of(member, workspaceRequest.getTitle(), workspaceRequest.getContent());
        workspaceRepository.save(workspace);

        return WorkspaceResponse.from(workspace);
    }

    /**
     * 특정 워크스페이스 조회
     */
    public WorkspaceResponse getWorkspaceById(final Integer memberId, final Integer workspaceId) {
        Workspace workspace = getWorkspace(memberId, workspaceId);
        return WorkspaceResponse.from(workspace);
    }

    /**
     * 전체 워크스페이스 조회
     */
    public List<WorkspaceResponse> getAllWorkspaces(final Integer memberId, final Integer lastWorkspaceId, final Integer pageSize) {
        return workspaceRepository.findWorkspacesByMemberIdAndLastWorkspaceId(memberId, lastWorkspaceId, pageSize).stream()
                .map(WorkspaceResponse::from)
                .toList();
    }

    /**
     * 워크스페이스 수정
     */
    public WorkspaceResponse updateWorkspace(final Integer memberId, final Integer workspaceId, final WorkspaceRequest updatedWorkspace) {
        Workspace workspace = getWorkspace(memberId, workspaceId);
        workspace.updateWorkspace(updatedWorkspace.getTitle(), updatedWorkspace.getContent());

        return WorkspaceResponse.from(workspace);
    }

    /**
     * 워크스페이스 삭제
     */
    public void deleteWorkspace(final Integer memberId, final Integer workspaceId) {
        Workspace workspace = getWorkspace(memberId, workspaceId);
        workspaceRepository.delete(workspace);
    }

    private Member getMember(final Integer memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    /**
     * 작성자와 같은 워크스페이스만 가져옴
     * 기존 방식은 DB 2번 접근 -> 쿼리로 한번에 접근하도록 바꿈
     */
    private Workspace getWorkspace(final Integer memberId, final Integer workspaceId) {
        return workspaceRepository.findByMemberIdAndId(memberId, workspaceId)
                .orElseThrow(() -> new CustomException(ErrorCode.WORKSPACE_NOT_FOUND, "Workspace not found"));
    }
}
