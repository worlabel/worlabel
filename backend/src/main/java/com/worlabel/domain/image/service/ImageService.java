package com.worlabel.domain.image.service;

import com.worlabel.domain.folder.entity.Folder;
import com.worlabel.domain.folder.repository.FolderRepository;
import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.entity.dto.ImageResponse;
import com.worlabel.domain.image.entity.dto.ImageStatusRequest;
import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.domain.participant.entity.Participant;
import com.worlabel.domain.participant.repository.ParticipantRepository;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.service.S3UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ImageService {

    private final S3UploadService s3UploadService;
    private final ImageRepository imageRepository;
    private final FolderRepository folderRepository;
    private final ParticipantRepository participantRepository;

    /**
     * 이미지 리스트 업로드
     */
    public void uploadImageList(final List<MultipartFile> imageList, final Integer folderId, final Integer projectId, final Integer memberId) {
        // 권한이 편집자 이상인지 확인
        checkEditorParticipant(memberId, projectId);
        Folder folder = getFolder(folderId);
        for (int order = 0; order < imageList.size(); order++) {
            MultipartFile file = imageList.get(order);
            String imageUrl = s3UploadService.upload(file, projectId);
            Image image = Image.of(file.getOriginalFilename(), imageUrl, order, folder);
            imageRepository.save(image);
        }
    }

    /**
     * 아이디 기반 이미지 조회
     */
    @Transactional(readOnly = true)
    public ImageResponse getImageById(final Integer projectId, final Integer folderId, final Long imageId, final Integer memberId) {
        // 참가에 존재하는지 확인
        checkExistParticipant(memberId, projectId);

        // 이미지가 해당 프로젝트에 속하는지 확인
        Image image = getImageAndValidateProject(folderId, imageId, projectId);
        return ImageResponse.from(image);
    }

    /**
     * 이미지 폴더 위치 변경
     */
    public void moveFolder(
            final Integer projectId,
            final Integer folderId,
            final Integer moveFolderId,
            final Long imageId,
            final Integer memberId
    ) {
        // 권한이 편집자 이상인지 확인
        checkEditorParticipant(memberId, projectId);
        Folder folder = null;
        if (moveFolderId != null) {
            folder = getFolder(moveFolderId);
        }

        // 이미지가 해당 프로젝트에 속하는지 확인
        Image image = getImageAndValidateProject(folderId, imageId, projectId);
        image.moveFolder(folder);
    }

    /**
     * 이미지 삭제
     */
    public void deleteImage(final Integer projectId, final Integer folderId, final Long imageId, final Integer memberId) {
        // 권한이 편집자 이상인지 확인
        checkEditorParticipant(memberId, projectId);

        // 이미지가 해당 프로젝트에 속하는지 확인
        Image image = getImageAndValidateProject(folderId, imageId, projectId);

        imageRepository.delete(image);
        s3UploadService.deleteImageFromS3(image.getImageUrl());
    }

    /**
     * 이미지 상태 변경
     */
    public ImageResponse changeImageStatus(final Integer projectId, final Integer folderId, final Long imageId, final Integer memberId, final ImageStatusRequest imageStatusRequest) {
        // 참가에 존재하는지 확인
        checkExistParticipant(memberId, projectId);

        // 이미지가 해당 프로젝트에 속하는지 확인
        Image image = getImageAndValidateProject(folderId, imageId, projectId);

        // 이미지 상태 변경 로직 추가 (생략)
        image.updateStatus(imageStatusRequest.getLabelStatus());

        return ImageResponse.from(image);
    }

    // 참가에 존재하는지 확인
    private void checkExistParticipant(final Integer memberId, final Integer projectId) {
        if (!participantRepository.existsByMemberIdAndProjectId(memberId, projectId)) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }
    }

    // 편집자 이상의 권한을 확인하는 메서드
    private void checkEditorParticipant(final Integer memberId, final Integer projectId) {
        Participant participant = participantRepository.findByMemberIdAndProjectId(memberId, projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED));

        if (!participant.getPrivilege().isEditeAuth()) {
            throw new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED);
        }
    }

    // 폴더 가져오기
    private Folder getFolder(final Integer folderId) {
        return folderRepository.findById(folderId)
                .orElseThrow(() -> new CustomException(ErrorCode.FOLDER_NOT_FOUND));
    }

    // 이미지 가져오면서 프로젝트 소속 여부를 확인
    private Image getImageAndValidateProject(final Integer folderId, final Long imageId, final Integer projectId) {
        Image image = imageRepository.findByIdAndFolderId(imageId, folderId)
                .orElseThrow(() -> new CustomException(ErrorCode.IMAGE_NOT_FOUND));

        // 이미지가 해당 프로젝트에 속하는지 확인
        if (!image.getFolder().getProject().getId().equals(projectId)) {
            throw new CustomException(ErrorCode.PROJECT_IMAGE_MISMATCH);
        }

        return image;
    }
}
