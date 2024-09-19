package com.worlabel.domain.image.service;

import com.worlabel.domain.folder.entity.Folder;
import com.worlabel.domain.folder.repository.FolderRepository;
import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.entity.dto.DetailImageResponse;
import com.worlabel.domain.image.entity.dto.ImageLabelRequest;
import com.worlabel.domain.image.entity.dto.ImageResponse;
import com.worlabel.domain.image.entity.dto.ImageStatusRequest;
import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.global.annotation.CheckPrivilege;
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

    /**
     * 이미지 리스트 업로드
     */
    @CheckPrivilege(value = PrivilegeType.EDITOR)
    public void uploadImageList(final List<MultipartFile> imageList, final Integer folderId, final Integer projectId, final Integer memberId) {
        Folder folder = getFolder(folderId);
        for (int order = 0; order < imageList.size(); order++) {
            MultipartFile file = imageList.get(order);
            String extension = getExtension(file);
            String imageKey = s3UploadService.upload(file,extension, projectId);
            Image image = Image.of(file.getOriginalFilename(), imageKey, extension, order, folder);
            imageRepository.save(image);
        }
    }

    /**
     * 아이디 기반 이미지 조회
     */
    @CheckPrivilege(PrivilegeType.VIEWER)
    @Transactional(readOnly = true)
    public DetailImageResponse getImageById(final Integer projectId, final Integer folderId, final Long imageId, final Integer memberId) {
        Image image = getImageByIdAndFolderIdAndFolderProjectId(folderId, imageId, projectId); // 이미지가 해당 프로젝트에 속하는지 확인
        String data = s3UploadService.getData(image.getDataPath());
        return DetailImageResponse.from(image,data);
    }

    /**
     * 이미지 폴더 위치 변경
     */
    @CheckPrivilege(PrivilegeType.EDITOR)
    public void moveFolder(final Integer projectId, final Integer folderId, final Integer moveFolderId, final Long imageId, final Integer memberId) {
        Folder folder = null;
        if (moveFolderId != null) {
            folder = getFolder(moveFolderId);
        }

        Image image = getImageByIdAndFolderIdAndFolderProjectId(folderId, imageId, projectId);
        image.moveFolder(folder);
    }

    /**
     * 이미지 삭제
     */
    @CheckPrivilege(PrivilegeType.EDITOR)
    public void deleteImage(final Integer projectId, final Integer folderId, final Long imageId, final Integer memberId) {
        // 이미지가 해당 프로젝트에 속하는지 확인
        Image image = getImageByIdAndFolderIdAndFolderProjectId(folderId, imageId, projectId);

        imageRepository.delete(image);
        s3UploadService.deleteImageFromS3(image.getImageKey());
    }

    /**
     * 이미지 상태 변경
     */
    @CheckPrivilege(PrivilegeType.VIEWER)
    public ImageResponse changeImageStatus(final Integer projectId, final Integer folderId, final Long imageId, final Integer memberId, final ImageStatusRequest imageStatusRequest) {
        // 이미지가 해당 프로젝트에 속하는지 확인
        Image image = getImageByIdAndFolderIdAndFolderProjectId(folderId, imageId, projectId);

        // 이미지 상태 변경 로직 추가 (생략)
        image.updateStatus(imageStatusRequest.getLabelStatus());

        return ImageResponse.from(image);
    }

    /**
     * 사용자가 수정한 레이블링 설정
     */
    @CheckPrivilege(PrivilegeType.EDITOR)
    public void saveUserLabel(final Integer memberId, final Integer projectId, final Long imageId, final ImageLabelRequest labelRequest) {
        save(imageId, labelRequest.getData());
    }

    private void save(final long imageId, final String data) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));

        String dataPath = image.getDataPath();
        s3UploadService.uploadJson(data, dataPath);
    }

    private String getExtension(final MultipartFile file) {
        String fileName = file.getOriginalFilename();
        return fileName.substring(fileName.lastIndexOf(".") + 1); // 파일 확장자
    }

    // 폴더 가져오기
    private Folder getFolder(final Integer folderId) {
        return folderRepository.findById(folderId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

    // 이미지 가져오면서 프로젝트 소속 여부를 확인
    private Image getImageByIdAndFolderIdAndFolderProjectId(final Integer folderId, final Long imageId, final Integer projectId) {
        return imageRepository.findByIdAndFolderIdAndFolderProjectId(imageId, folderId, projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }
}
