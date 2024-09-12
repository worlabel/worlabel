package com.worlabel.domain.workspace.service;

import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.member.repository.MemberRepository;
import com.worlabel.domain.participant.repository.WorkspaceParticipantRepository;
import com.worlabel.domain.workspace.entity.Workspace;
import com.worlabel.domain.workspace.entity.dto.WorkspaceRequest;
import com.worlabel.domain.workspace.entity.dto.WorkspaceResponse;
import com.worlabel.domain.workspace.repository.WorkspaceRepository;
import com.worlabel.fixture.MemberFixture;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkspaceServiceUnitTest {

    @InjectMocks
    private WorkspaceService workspaceService;

    @Mock
    private WorkspaceRepository workspaceRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private WorkspaceParticipantRepository workspaceParticipantRepository;

    private Member member;
    private Workspace workspace;

    @BeforeEach
    void init() {
        member = MemberFixture.makeMember();
        workspace = Workspace.of(member, "initTitle", "initContent");
    }

    @DisplayName("워크스페이스 생성 시 제목이 비어있으면 예외가 발생한다.")
    @Test
    void throws_exception_when_create_workspace_with_empty_title() {
        //given
        when(memberRepository.findById(1)).thenReturn(Optional.of(member));
        WorkspaceRequest request = new WorkspaceRequest("", "content");

        //when & then
        assertThatThrownBy(() -> workspaceService.createWorkspace(1, request))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.BAD_REQUEST.getMessage());
    }

    @DisplayName("워크스페이스 생성 시 사용자가 존재하지 않으면 예외가 발생한다.")
    @Test
    void throws_exception_when_create_workspace_with_invalid_member() {
        //given
        given(memberRepository.findById(anyInt())).willReturn(Optional.empty());
        WorkspaceRequest request = new WorkspaceRequest("title", "content");

        //when & then
        assertThatThrownBy(() -> workspaceService.createWorkspace(anyInt(), request))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.USER_NOT_FOUND.getMessage());
    }

    @DisplayName("특정 워크스페이스 조회 시 존재하지 않으면 예외가 발생한다.")
    @Test
    void throws_exception_when_find_workspace_with_invalid_workspace_id() {
        //given
        Integer workspaceId = 1;
        given(workspaceRepository.findById(eq(workspaceId))).willReturn(Optional.empty());
        given(workspaceParticipantRepository.existsByMemberIdAndWorkspaceId(1, workspaceId)).willReturn(true);

        //when & then
        assertThatThrownBy(() -> workspaceService.getWorkspaceById(1, workspaceId))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.WORKSPACE_NOT_FOUND.getMessage());
    }

    @DisplayName("워크스페이스 수정 시 제목이 비어있으면 예외가 발생한다.")
    @Test
    void throws_exception_when_update_workspace_with_empty_title() {
        //given
        WorkspaceRequest request = new WorkspaceRequest("", "updateContent");
        given(workspaceRepository.findByMemberIdAndId(anyInt(), anyInt())).willReturn(Optional.of(workspace));

        //when & then
        assertThatThrownBy(() -> workspaceService.updateWorkspace(anyInt(), anyInt(), request))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.BAD_REQUEST.getMessage());
    }

    @DisplayName("워크스페이스 수정 시 내용이 비어있으면 예외가 발생한다.")
    @Test
    void throws_exception_when_update_workspace_with_empty_content() {
        //given
        WorkspaceRequest request = new WorkspaceRequest("updateTitle", "");
        given(workspaceRepository.findByMemberIdAndId(anyInt(), anyInt())).willReturn(Optional.of(workspace));

        //when & then
        assertThatThrownBy(() -> workspaceService.updateWorkspace(anyInt(), anyInt(), request))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.BAD_REQUEST.getMessage());
    }

    @DisplayName("워크스페이스 삭제 시 존재하지 않으면 예외가 발생한다.")
    @Test
    void throws_exception_when_delete_workspace_with_invalid_workspace_id() {
        //given
        Integer workspaceId = 1;
        given(workspaceRepository.findByMemberIdAndId(anyInt(), eq(workspaceId))).willReturn(Optional.empty());

        //when & then
        assertThatThrownBy(() -> workspaceService.deleteWorkspace(1, workspaceId))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.NOT_AUTHOR.getMessage());
    }

    @DisplayName("특정 워크스페이스 조회에 성공하면 정상적으로 반환된다.")
    @Test
    void success_when_find_workspace_by_id() {
        //given
        Integer workspaceId = 1;
        given(workspaceParticipantRepository.existsByMemberIdAndWorkspaceId(1, workspaceId)).willReturn(true);
        given(workspaceRepository.findById(eq(workspaceId))).willReturn(Optional.of(workspace));

        //when
        WorkspaceResponse response = workspaceService.getWorkspaceById(1, workspaceId);

        //then
        assertNotNull(response);
        assertEquals("initTitle", response.getTitle());
        assertEquals("initContent", response.getContent());
    }

    @DisplayName("전체 워크스페이스 조회에 성공하면 정상적으로 반환된다.")
    @Test
    void success_when_find_all_workspaces() {
        //given
        Integer lastWorkspaceId = null;
        Integer pageSize = 10;
        Workspace workspace1 = Workspace.of(member, "Title 1", "Content 1");
        Workspace workspace2 = Workspace.of(member, "Title 2", "Content 2");

        given(workspaceRepository.findWorkspacesByMemberIdWithPagination(member.getId(), lastWorkspaceId, pageSize))
                .willReturn(List.of(workspace1, workspace2));

        //when
        List<WorkspaceResponse> responses = workspaceService.getAllWorkspaces(member.getId(), lastWorkspaceId, pageSize);

        //then
        assertEquals(2, responses.size());
    }

    @DisplayName("워크스페이스 수정에 성공하면 수정된 결과를 반환한다.")
    @Test
    void success_when_update_workspace() {
        //given
        WorkspaceRequest request = new WorkspaceRequest("Updated Title", "Updated Content");
        given(workspaceRepository.findByMemberIdAndId(anyInt(), anyInt())).willReturn(Optional.of(workspace));

        //when
        WorkspaceResponse response = workspaceService.updateWorkspace(anyInt(), anyInt(), request);

        //then
        assertNotNull(response);
        assertEquals("Updated Title", response.getTitle());
        assertEquals("Updated Content", response.getContent());
    }

    @DisplayName("워크스페이스 삭제에 성공하면 예외 없이 수행된다.")
    @Test
    void success_when_delete_workspace() {
        //given
        Integer workspaceId = 1;
        given(workspaceRepository.findByMemberIdAndId(anyInt(), eq(workspaceId))).willReturn(Optional.of(workspace));

        //when
        workspaceService.deleteWorkspace(1, workspaceId);

        //then
        verify(workspaceRepository, times(1)).delete(workspace);
    }
}
