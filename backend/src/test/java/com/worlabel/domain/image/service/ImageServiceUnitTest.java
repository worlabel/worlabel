package com.worlabel.domain.image.service;

import com.worlabel.domain.folder.entity.Folder;
import com.worlabel.domain.folder.repository.FolderRepository;
import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.entity.LabelStatus;
import com.worlabel.domain.image.entity.dto.ImageResponse;
import com.worlabel.domain.image.entity.dto.ImageStatusRequest;
import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.participant.entity.Participant;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.domain.participant.repository.ParticipantRepository;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.entity.ProjectType;
import com.worlabel.domain.workspace.entity.Workspace;
import com.worlabel.fixture.MemberFixture;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.service.S3UploadService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ImageServiceUnitTest {

    @InjectMocks
    private ImageService imageService;

    @Mock
    private S3UploadService s3UploadService;

    @Mock
    private ImageRepository imageRepository;

    @Mock
    private FolderRepository folderRepository;

    @Mock
    private ParticipantRepository participantRepository;

    private Participant participant;
    private Folder folder;
    private Image image;
    private Project project;

    @BeforeEach
    void init() {
        Member member = MemberFixture.makeMember();
        Workspace workspace = Workspace.of(member, "title", "description");
        project = Project.of("title", workspace, ProjectType.DETECTION);
        folder = Folder.of("title", null, project);

        participant = Participant.of(project, member, PrivilegeType.ADMIN);

        image = Image.of("test.jpg", "url.com/test.jpg", 1, folder);
    }

    @DisplayName("이미지 업로드 시 권한이 없는 경우 예외 발생")
    @Test
    void throws_exception_when_upload_image_without_editor_privileges() {
        // given
        Member member = MemberFixture.makeMember2();
        Participant participant2 = Participant.of(project, member, PrivilegeType.VIEWER);
        given(participantRepository.findByMemberIdAndProjectId(anyInt(), anyInt())).willReturn(Optional.of(participant2));

        // when & then
        assertThatThrownBy(() -> imageService.uploadImageList(List.of(mock(MultipartFile.class)), 1, 1, 1))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED.getMessage());
    }

    @DisplayName("이미지 업로드 성공")
    @Test
    void success_when_upload_image() {
        // given
        given(participantRepository.findByMemberIdAndProjectId(anyInt(), anyInt()))
                .willReturn(Optional.of(participant));
        given(folderRepository.findById(anyInt())).willReturn(Optional.of(folder));
        given(s3UploadService.upload(any(MultipartFile.class), anyInt())).willReturn("url.com/test.jpg");

        // when
        imageService.uploadImageList(List.of(mock(MultipartFile.class)), 1, 1, 1);

        // then
        verify(imageRepository, times(1)).save(any(Image.class));
    }

    @DisplayName("이미지 조회 시 참가자가 아닌 경우 예외 발생")
    @Test
    void throws_exception_when_get_image_by_non_participant() {
        // given
        given(participantRepository.existsByMemberIdAndProjectId(anyInt(), anyInt())).willReturn(false);

        // when & then
        assertThatThrownBy(() -> imageService.getImageById(1, 1, 1L, 1))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining(ErrorCode.BAD_REQUEST.getMessage());
    }

    @DisplayName("이미지 조회 성공")
    @Test
    void success_when_get_image_by_id() {
        // given
        Folder mockFolder = mock(Folder.class);
        Project mockProject = mock(Project.class);
        Image mockImage = mock(Image.class); // image 대신 mockImage 사용

        // mock 설정
        given(mockImage.getFolder()).willReturn(mockFolder);
        given(mockImage.getTitle()).willReturn("test.jpg");
        given(mockFolder.getProject()).willReturn(mockProject);
        given(mockProject.getId()).willReturn(1); // 프로젝트 ID를 반환하게 설정

        given(participantRepository.existsByMemberIdAndProjectId(anyInt(), anyInt())).willReturn(true);
        given(imageRepository.findByIdAndFolderId(anyLong(), anyInt())).willReturn(Optional.of(mockImage));

        // when
//        ImageResponse response = imageService.getImageById(1, 1, 1L, 1);

        // then
        assertEquals("test.jpg", response.getImageTitle());
    }

    @DisplayName("이미지 삭제 성공")
    @Test
    void success_when_delete_image() {
        // given
        Folder mockFolder = mock(Folder.class);
        Project mockProject = mock(Project.class);
        Image mockImage = mock(Image.class); // image 대신 mockImage 사용

        // mock 설정
        given(mockImage.getFolder()).willReturn(mockFolder);
        given(mockFolder.getProject()).willReturn(mockProject);
        given(mockProject.getId()).willReturn(1); // 프로젝트 ID를 반환하게 설정

        // 이미지 URL 설정
        given(mockImage.getImageUrl()).willReturn("mock.jpg");

        // 참가자 존재 여부 확인
        given(participantRepository.findByMemberIdAndProjectId(anyInt(), anyInt())).willReturn(Optional.of(participant));

        // 이미지 조회 설정
        given(imageRepository.findByIdAndFolderId(anyLong(), anyInt())).willReturn(Optional.of(mockImage));

        // S3 삭제 동작 무시
        doNothing().when(s3UploadService).deleteImageFromS3("mock.jpg");

        // when
        imageService.deleteImage(1, 1, 1L, 1);

        // then
        verify(imageRepository, times(1)).delete(mockImage);
        verify(s3UploadService, times(1)).deleteImageFromS3("mock.jpg");
    }

    @DisplayName("이미지 상태 변경 성공")
    @Test
    void success_when_change_image_status() {
        // given
        Folder mockFolder = mock(Folder.class);
        Project mockProject = mock(Project.class);
        Image mockImage = mock(Image.class); // image 대신 mockImage 사용

        // mock 설정
        given(mockImage.getFolder()).willReturn(mockFolder);
        given(mockFolder.getProject()).willReturn(mockProject);
        given(mockProject.getId()).willReturn(1); // 프로젝트 ID를 반환하게 설정

        given(participantRepository.existsByMemberIdAndProjectId(anyInt(), anyInt())).willReturn(true);
        given(imageRepository.findByIdAndFolderId(anyLong(), anyInt())).willReturn(Optional.of(mockImage));

        ImageStatusRequest request = new ImageStatusRequest(LabelStatus.NEED_REVIEW);

        // 상태 업데이트가 정상적으로 이루어지도록 스터빙
        doAnswer(invocation -> {
            LabelStatus newStatus = invocation.getArgument(0);
            given(mockImage.getStatus()).willReturn(newStatus);
            return null;
        }).when(mockImage).updateStatus(any(LabelStatus.class));

        // when
        ImageResponse response = imageService.changeImageStatus(1, 1, 1L, 1, request);

        // then
        assertEquals(LabelStatus.NEED_REVIEW, response.getStatus());
    }

    @DisplayName("이미지 폴더 이동 성공")
    @Test
    void success_when_move_folder() {
        // given
        Folder mockFolder = mock(Folder.class);
        Project mockProject = mock(Project.class);
        Image mockImage = mock(Image.class);

        // mock 설정
        given(mockImage.getFolder()).willReturn(mockFolder);
        given(mockFolder.getProject()).willReturn(mockProject);
        given(mockProject.getId()).willReturn(1); // 프로젝트 ID 반환

        Folder folder2 = Folder.of("newTitle", mockFolder, mockProject);
        given(participantRepository.findByMemberIdAndProjectId(anyInt(), anyInt())).willReturn(Optional.of(participant));
        given(imageRepository.findByIdAndFolderId(anyLong(), anyInt())).willReturn(Optional.of(mockImage));
        given(folderRepository.findById(anyInt())).willReturn(Optional.of(folder2));

        // when
        imageService.moveFolder(1, 1, 2, 1L, 1);

        // then
        verify(mockImage, times(1)).moveFolder(folder2); // 폴더 이동이 이루어지는지 확인
    }
}
