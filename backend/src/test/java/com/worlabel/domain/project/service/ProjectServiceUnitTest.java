package com.worlabel.domain.project.service;

import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.member.repository.MemberRepository;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.domain.participant.repository.ParticipantRepository;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.entity.ProjectType;
import com.worlabel.domain.project.entity.dto.ProjectRequest;
import com.worlabel.domain.project.repository.ProjectRepository;
import com.worlabel.domain.workspace.entity.Workspace;
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

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceUnitTest {

    @InjectMocks
    private ProjectService projectService;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private WorkspaceRepository workspaceRepository;

    @Mock
    private ParticipantRepository participantRepository;

    @Mock
    private MemberRepository memberRepository;

    private Member member;
    private Workspace workspace;
    private Project project;

    @BeforeEach
    void init() {
        member = MemberFixture.makeMember();
        workspace = Workspace.of(member, "title", "description");
        project = Project.of("title", workspace, ProjectType.DETECTION);
    }

    @DisplayName("프로젝트 생성 시 사용자가 존재하지 않으면 예외가 발생한다.")
    @Test
    void throws_exception_when_create_project_with_invalid_member() {
        // given
        ProjectRequest request = new ProjectRequest("New Project", ProjectType.DETECTION);
        given(memberRepository.findById(anyInt())).willReturn(Optional.empty());
        given(workspaceRepository.findByMemberIdAndId(anyInt(), anyInt())).willReturn(Optional.of(workspace));

        // when & then
        assertThatThrownBy(() -> projectService.createProject(1, 1, request))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.USER_NOT_FOUND.getMessage());
    }

    @DisplayName("프로젝트 생성 시 워크스페이스가 존재하지 않으면 예외가 발생한다.")
    @Test
    void throws_exception_when_create_project_with_invalid_workspace() {
        // given
        ProjectRequest request = new ProjectRequest("New Project", ProjectType.DETECTION);
        given(workspaceRepository.findByMemberIdAndId(anyInt(), anyInt())).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> projectService.createProject(1, 1, request))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.WORKSPACE_NOT_FOUND.getMessage());
    }

    @DisplayName("프로젝트 생성에 성공하면 프로젝트가 반환된다.")
    @Test
    void success_when_create_project() {
        // given
        ProjectRequest request = new ProjectRequest("New Project", ProjectType.DETECTION);
        given(workspaceRepository.findByMemberIdAndId(anyInt(), anyInt())).willReturn(Optional.of(workspace));
        given(memberRepository.findById(anyInt())).willReturn(Optional.of(member));
        given(projectRepository.save(any(Project.class))).willReturn(project);

        // when
        var response = projectService.createProject(1, 1, request);

        // then
        assertNotNull(response);
        assertEquals("New Project", response.getTitle());
    }

    @DisplayName("프로젝트 조회 시 존재하지 않으면 예외가 발생한다.")
    @Test
    void throws_exception_when_find_project_with_invalid_id() {
        // given
        given(projectRepository.findById(anyInt())).willReturn(Optional.empty());
        given(participantRepository.existsByMemberIdAndProjectId(anyInt(), anyInt())).willReturn(true);

        // when & then
        assertThatThrownBy(() -> projectService.getProjectById( 1))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.PROJECT_NOT_FOUND.getMessage());
    }

    @DisplayName("프로젝트 조회에 성공하면 프로젝트가 반환된다.")
    @Test
    void success_when_find_project_by_id() {
        // given
        given(participantRepository.existsByMemberIdAndProjectId(anyInt(), anyInt())).willReturn(true);
        given(projectRepository.findById(anyInt())).willReturn(Optional.of(project));

        // when
        var response = projectService.getProjectById( 1);

        // then
        assertNotNull(response);
    }

    @DisplayName("프로젝트 수정 시 관리자가 아니면 예외가 발생한다.")
    @Test
    void throws_exception_when_update_project_without_admin_privilege() {
        // given
        ProjectRequest request = new ProjectRequest("Updated Title", ProjectType.SEGMENTATION);
        given(participantRepository.existsByProjectIdAndMemberIdAndPrivilege(anyInt(), anyInt(), eq(PrivilegeType.ADMIN)))
                .willReturn(false);

        // when & then
        assertThatThrownBy(() -> projectService.updateProject(1, request))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED.getMessage());
    }

    @DisplayName("프로젝트 수정에 성공하면 수정된 프로젝트가 반환된다.")
    @Test
    void success_when_update_project() {
        // given
        ProjectRequest request = new ProjectRequest("Updated Title", ProjectType.SEGMENTATION);
        given(participantRepository.existsByProjectIdAndMemberIdAndPrivilege(anyInt(), anyInt(), eq(PrivilegeType.ADMIN)))
                .willReturn(true);
        given(projectRepository.findById(anyInt())).willReturn(Optional.of(project));

        // when
        var response = projectService.updateProject(1, request);

        // then
        assertNotNull(response);
        assertEquals("Updated Title", response.getTitle());
    }

    @DisplayName("프로젝트 삭제 시 관리자가 아니면 예외가 발생한다.")
    @Test
    void throws_exception_when_delete_project_without_admin_privilege() {
        // given
        given(participantRepository.existsByProjectIdAndMemberIdAndPrivilege(anyInt(), anyInt(), eq(PrivilegeType.ADMIN)))
                .willReturn(false);

        // when & then
        assertThatThrownBy(() -> projectService.deleteProject(1, 1))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED.getMessage());
    }

    @DisplayName("프로젝트 삭제에 성공하면 예외 없이 수행된다.")
    @Test
    void success_when_delete_project() {
        // given
        given(participantRepository.existsByProjectIdAndMemberIdAndPrivilege(anyInt(), anyInt(), eq(PrivilegeType.ADMIN)))
                .willReturn(true);

        // when
        projectService.deleteProject(1, 1);

        // then
        verify(projectRepository, times(1)).deleteById(1);
    }
}
