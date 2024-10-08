package com.worlabel.domain.folder.service;

import com.worlabel.domain.folder.entity.Folder;
import com.worlabel.domain.folder.entity.dto.FolderRequest;
import com.worlabel.domain.folder.entity.dto.FolderResponse;
import com.worlabel.domain.folder.repository.FolderRepository;
import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.participant.repository.ParticipantRepository;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.entity.ProjectType;
import com.worlabel.domain.project.repository.ProjectRepository;
import com.worlabel.domain.workspace.entity.Workspace;
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
class FolderServiceUnitTest {

    @InjectMocks
    private FolderService folderService;

    @Mock
    private FolderRepository folderRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ParticipantRepository participantRepository;

    private Folder folder;
    private Project project;

    @BeforeEach
    void init() {
        Member member = MemberFixture.makeMember();
        Workspace workspace = Workspace.of(member, "title", "description");
        project = Project.of("title", workspace, ProjectType.DETECTION);
        folder = Folder.of("Test Folder", null, project);
    }

    @DisplayName("폴더 생성 시 참가자 권한이 없으면 예외가 발생한다.")
    @Test
    void throws_exception_when_create_folder_without_privileges() {
        // given
        FolderRequest request = new FolderRequest("New Folder", 0);

        // when & then
        assertThatThrownBy(() -> folderService.createFolder(1, request))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.FOLDER_UNAUTHORIZED.getMessage());
    }

    @DisplayName("폴더 생성에 성공하면 생성된 폴더를 반환한다.")
    @Test
    void success_when_create_folder() {
        // given
        FolderRequest request = new FolderRequest("New Folder", 0);
        given(projectRepository.findById(anyInt())).willReturn(Optional.of(project));
        given(folderRepository.save(any(Folder.class))).willReturn(folder);

        // when
        FolderResponse response = folderService.createFolder(1, request);

        // then
        assertNotNull(response);
        assertEquals("New Folder", response.getTitle());
    }

    @DisplayName("폴더 조회 시 참가자가 아니면 예외가 발생한다.")
    @Test
    void throws_exception_when_get_folder_by_non_participant() {
        // given
        given(participantRepository.existsByMemberIdAndProjectId(anyInt(), anyInt())).willReturn(false);

        // when & then
        assertThatThrownBy(() -> folderService.getFolderById(1, 1))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.BAD_REQUEST.getMessage());
    }

    @DisplayName("폴더 조회에 성공하면 정상적으로 반환된다.")
    @Test
    void success_when_get_folder_by_id() {
        // given
        given(participantRepository.existsByMemberIdAndProjectId(anyInt(), anyInt())).willReturn(true);
        given(folderRepository.findAllByProjectIdAndId(anyInt(), anyInt())).willReturn(Optional.of(folder));

        // when
        FolderResponse response = folderService.getFolderById(1, 1);

        // then
        assertNotNull(response);
        assertEquals("Test Folder", response.getTitle());
    }

    @DisplayName("폴더 삭제 시 참가자 권한이 없으면 예외가 발생한다.")
    @Test
    void throws_exception_when_delete_folder_without_privileges() {

        // when & then
        assertThatThrownBy(() -> folderService.deleteFolder(1, 1))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.FOLDER_UNAUTHORIZED.getMessage());
    }

    @DisplayName("폴더 삭제에 성공하면 예외 없이 삭제가 수행된다.")
    @Test
    void success_when_delete_folder() {
        // given
        given(folderRepository.findAllByProjectIdAndId(anyInt(), anyInt())).willReturn(Optional.of(folder));

        // when
        folderService.deleteFolder(1, 1);

        // then
        verify(folderRepository, times(1)).delete(folder);
    }

    @DisplayName("폴더 수정 시 참가자 권한이 없으면 예외가 발생한다.")
    @Test
    void throws_exception_when_update_folder_without_privileges() {
        // given
        FolderRequest request = new FolderRequest("Updated Folder", 0);

        // when & then
        assertThatThrownBy(() -> folderService.updateFolder( 1, 1, request))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.FOLDER_UNAUTHORIZED.getMessage());
    }

    @DisplayName("폴더 수정에 성공하면 수정된 폴더를 반환한다.")
    @Test
    void success_when_update_folder() {
        // given
        FolderRequest request = new FolderRequest("Updated Folder", 0);

        given(folderRepository.findAllByProjectIdAndId(anyInt(), anyInt())).willReturn(Optional.of(folder));

        // when
        FolderResponse response = folderService.updateFolder( 1, 1, request);

        // then
        assertNotNull(response);
        assertEquals("Updated Folder", response.getTitle());
    }
}
