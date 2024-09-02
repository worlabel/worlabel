package com.worlabel.domain.image.service;

import com.worlabel.domain.folder.entity.Folder;
import com.worlabel.domain.folder.repository.FolderRepository;
import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.entity.dto.ImageResponse;
import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.domain.participant.entity.PrivilegeType;
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
        checkEditorParticipant(memberId, projectId);
        Folder folder = getFolder(folderId);
        for (int i = 0; i < imageList.size(); i++) {
            MultipartFile file = imageList.get(i);
            String imageUrl = s3UploadService.upload(file, projectId);
            Image image = Image.of(file.getOriginalFilename(), imageUrl, i, folder);
            imageRepository.save(image);
        }
    }

    /**
     * 아이디 기반 이미지 조회
     */
    @Transactional(readOnly = true)
    public ImageResponse getImageById(final Integer projectId, final Integer folderId, final Integer imageId, final Integer memberId) {
        checkExistParticipant(memberId, projectId);
        Image image = imageRepository.findByIdAndFolderId(imageId,folderId)
                .orElseThrow(() -> new CustomException(ErrorCode.IMAGE_NOT_FOUND));
        return ImageResponse.from(image);
    }

    /**
     * 이미지 폴더 위치 변경
     */
    public void moveFolder(final Integer projectId,
                           final Integer moveFolderId,
                           final Integer imageId,
                           final Integer memberId) {
        checkEditorParticipant(memberId, projectId);
        Folder folder = null;
        if(moveFolderId != null) folder = getFolder(moveFolderId);
        Image image = imageRepository.findById(imageId).orElseThrow(() -> new CustomException(ErrorCode.IMAGE_NOT_FOUND));

        image.moveFolder(folder);
    }

    private void checkExistFolderInProject(final Integer folderId, final Integer projectId) {
        if(!folderRepository.existsByIdAndProjectId(folderId, projectId)) {
            throw new CustomException(ErrorCode.FOLDER_NOT_FOUND);
        }
    }

    private void checkExistParticipant(final Integer memberId, final Integer projectId) {
        if (!participantRepository.existsByMemberIdAndProjectId(memberId, projectId)) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }
    }

    private void checkEditorParticipant(final Integer memberId, final Integer projectId) {
        if (!participantRepository.doesParticipantUnauthorizedExistByMemberIdAndProjectId(projectId, memberId)) {
            throw new CustomException(ErrorCode.PARTICIPANT_UNAUTHORIZED);
        }
    }

    private Folder getFolder(final Integer folderId) {
        return folderRepository.findById(folderId)
                .orElseThrow(() -> new CustomException(ErrorCode.FOLDER_NOT_FOUND));
    }


}
