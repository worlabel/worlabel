package com.worlabel.domain.image.service;

import com.worlabel.domain.folder.entity.Folder;
import com.worlabel.domain.folder.repository.FolderRepository;
import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.entity.dto.*;
import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.domain.project.repository.ProjectRepository;
import com.worlabel.global.annotation.CheckPrivilege;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.service.S3UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ImageService {

    private final S3UploadService s3UploadService;
    private final ImageRepository imageRepository;
    private final FolderRepository folderRepository;
    private final ProjectRepository projectRepository;

    /**
     * 이미지 리스트 업로드
     */
    @CheckPrivilege(value = PrivilegeType.EDITOR)
    public void uploadImageList(final List<MultipartFile> imageList, final Integer folderId, final Integer projectId, final Integer memberId) {
        Folder folder;

        if (folderId != 0) {
            folder = getFolder(folderId);
        } else {
            String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
            folder = Folder.of(currentDateTime, null, project);
        }

        for (MultipartFile file : imageList) {
            String extension = getExtension(file);
            String imageKey = s3UploadService.upload(file, extension, projectId);
            Image image = Image.of(file.getOriginalFilename(), imageKey, extension, folder);
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
        return DetailImageResponse.from(image, data);
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

    public void uploadFolderWithImages(MultipartFile folderOrZip, Integer projectId, Integer folderId) throws IOException {
        // 프로젝트 정보 가져오기
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        Folder parentFolder;

        if (folderId != 0) {
            parentFolder = getFolder(folderId);
        } else {
            String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            parentFolder = Folder.of(currentDateTime, null, project);
        }

        // 파일이 zip 파일인지 확인
        String originalFilename = folderOrZip.getOriginalFilename();
        if (originalFilename != null && originalFilename.endsWith(".zip")) {
            // 압축 파일인 경우
            Path tempDir = Files.createTempDirectory("uploadedFolder");
            unzip(folderOrZip, tempDir.toString());

            // 압축 풀린 폴더를 재귀적으로 탐색하여 하위 폴더 및 이미지 파일을 저장
            processFolderRecursively(tempDir.toFile(), parentFolder, project);
        } else {
            // 압축 파일이 아닌 경우 (단일 폴더 또는 파일)
            File tempFolder = new File(System.getProperty("java.io.tmpdir"), originalFilename);
            folderOrZip.transferTo(tempFolder); // 파일을 임시 디렉토리에 저장

            // 폴더 또는 파일을 재귀적으로 탐색하여 저장
            processFolderRecursively(tempFolder, parentFolder, project);
        }
    }

    // 폴더 내부 구조를 재귀적으로 탐색하여 저장
    private void processFolderRecursively(File directory, Folder parentFolder, Project project) {
        if (directory.exists() && directory.isDirectory()) {
            Folder currentFolder = Folder.of(directory.getName(), parentFolder, project);
            folderRepository.save(currentFolder);

            File[] files = directory.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isDirectory()) {
                        // 하위 폴더인 경우 재귀 호출
                        processFolderRecursively(file, currentFolder, project);
                    } else if (isImageFile(file)) {
                        // 이미지 파일인 경우
                        String fileName = file.getName();
                        String extension = fileName.substring(fileName.lastIndexOf(".") + 1);

                        try (InputStream inputStream = new FileInputStream(file)) {
                            // InputStream으로 S3 업로드
                            String imageKey = s3UploadService.uploadFromInputStream(inputStream, extension, project.getId(), file.getName());

                            Image image = Image.of(file.getName(), imageKey, extension, currentFolder);
                            imageRepository.save(image);
                        } catch (IOException e) {
                            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE);
                        }
                    }
                }
            }
        }
    }

    // 이미지 파일인지 확인하는 메서드
    private boolean isImageFile(File file) {
        String fileName = file.getName().toLowerCase();
        return fileName.endsWith(".jpg") || fileName.endsWith(".png") || fileName.endsWith(".jpeg");
    }

    // 압축 파일을 임시 폴더에 압축 해제하는 메서드
    private void unzip(MultipartFile zipFile, String destDir) throws IOException {
        try (ZipInputStream zis = new ZipInputStream(zipFile.getInputStream())) {
            ZipEntry zipEntry;
            while ((zipEntry = zis.getNextEntry()) != null) {
                Path newPath = zipSlipProtect(zipEntry, Paths.get(destDir));
                if (zipEntry.isDirectory()) {
                    Files.createDirectories(newPath);
                } else {
                    Files.createDirectories(newPath.getParent());
                    Files.copy(zis, newPath);
                }
                zis.closeEntry();
            }
        }
    }

    // 보안 보호를 위해 압축 파일 경로를 보호하는 메서드
    private Path zipSlipProtect(ZipEntry zipEntry, Path targetDir) throws IOException {
        Path targetDirResolved = targetDir.resolve(zipEntry.getName());
        Path normalizePath = targetDirResolved.normalize();
        if (!normalizePath.startsWith(targetDir)) {
            throw new IOException("Zip entry is outside of the target dir: " + zipEntry.getName());
        }
        return normalizePath;
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
