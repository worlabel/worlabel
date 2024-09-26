package com.worlabel.domain.image.service;

import com.worlabel.domain.folder.entity.Folder;
import com.worlabel.domain.folder.repository.FolderRepository;
import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.entity.LabelStatus;
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
    public void uploadImageList(final List<MultipartFile> imageList, final Integer folderId, final Integer projectId) {
        Folder folder = getOrCreateFolder(folderId, projectId);

        // 이미지 리스트를 순차적으로 처리 (향후 비동기/병렬 처리를 위해 분리된 메서드 호출)
        imageList.forEach(file -> uploadAndSave(file, folder, projectId));
    }

    /**
     * 폴더 생성 또는 가져오기
     * 폴더 생성 작업이 있음으로 트랜잭션 보호
     */
    public Folder getOrCreateFolder(Integer folderId, Integer projectId) {
        if (folderId != 0) {
            return getFolder(folderId);
        } else {
            String currentDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            Project project = getProject(projectId);
            Folder folder = Folder.of(currentDateTime, null, project);
            folderRepository.save(folder);  // 새로운 폴더를 저장
            return folder;
        }
    }

    /**
     * Zip 파일 처리 메서드
     */
    @CheckPrivilege(PrivilegeType.EDITOR)
    public void uploadFolderWithImages(final MultipartFile folderOrZip, final Integer projectId, final Integer folderId) throws IOException {
        log.debug("파일 크기: {}, 기존 파일 이름: {} ", folderOrZip.getSize(), folderOrZip.getOriginalFilename());

        // 프로젝트 정보 가져오기
        Project project = getProject(projectId);
        Folder parentFolder = getOrCreateFolder(folderId, projectId);

        String originalFilename = folderOrZip.getOriginalFilename();
        if (originalFilename != null && originalFilename.endsWith(".zip")) {
            // Zip 파일 처리
            Path tempDir = Files.createTempDirectory("uploadedFolder");
            unzip(folderOrZip, tempDir.toString());
            processFolderRecursively(tempDir.toFile(), parentFolder, project);
        } else {
            // 압축 파일이 아닌 경우 (단일 폴더 또는 파일)
            File tempFolder = new File(System.getProperty("java.io.tmpdir"), originalFilename);
            folderOrZip.transferTo(tempFolder); // 파일을 임시 디렉토리에 저장
            // 폴더 또는 파일을 재귀적으로 탐색하여 저장
            processFolderRecursively(tempFolder, parentFolder, project);
        }
    }

    /**
     * 폴더 및 파일을 재귀적으로 탐색하여 처리
     */
    private void processFolderRecursively(File directory, Folder parentFolder, Project project) {
        if (directory.exists() && directory.isDirectory()) {
            Folder currentFolder = createFolderAndSave(directory.getName(), parentFolder, project);

            File[] files = directory.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isDirectory()) {
                        processFolderRecursively(file, currentFolder, project);
                    } else if (isImageFile(file)) {
                        uploadAndSave(file, currentFolder, project);
                    }
                }
            }
        }
    }

    /**
     * 이미지 상태 변경
     */
    @CheckPrivilege(PrivilegeType.VIEWER)
    public ImageResponse changeImageStatus(final Integer projectId, final Integer folderId, final Long imageId, final ImageStatusRequest imageStatusRequest) {
        Image image = getImageByIdAndFolderIdAndFolderProjectId(folderId, imageId, projectId);
        image.updateStatus(imageStatusRequest.getLabelStatus()); // 이미지 상태 업데이트
        return ImageResponse.from(image);
    }

    /**
     * 사용자가 수정한 레이블링 설정
     */
    @CheckPrivilege(PrivilegeType.EDITOR)
    public void saveUserLabel(final Integer projectId, final Long imageId, final ImageLabelRequest labelRequest) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
        String dataPath = image.getDataPath();
        image.updateStatus(LabelStatus.SAVE);
        imageRepository.save(image);
        s3UploadService.uploadJson(labelRequest.getData(), dataPath);
    }


    /**
     * 아이디 기반 이미지 조회
     */
    @Transactional(readOnly = true)
    @CheckPrivilege(PrivilegeType.VIEWER)
    public ImageResponse getImageById(final Integer projectId, final Integer folderId, final Long imageId) {
        Image image = getImageByIdAndFolderIdAndFolderProjectId(folderId, imageId, projectId); // 이미지가 해당 프로젝트에 속하는지 확인
        return ImageResponse.from(image);
    }

    /**
     * 이미지 폴더 위치 변경
     */
    @CheckPrivilege(PrivilegeType.EDITOR)
    public void moveFolder(final Integer projectId, final Integer folderId, final Integer moveFolderId, final Long imageId) {
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
    public void deleteImage(final Integer projectId, final Integer folderId, final Long imageId) {
        // 이미지가 해당 프로젝트에 속하는지 확인
        Image image = getImageByIdAndFolderIdAndFolderProjectId(folderId, imageId, projectId);
        imageRepository.delete(image);
        s3UploadService.deleteImageFromS3(image.getImageKey());
    }

    /**
     * 폴더 저장
     */
    private Folder createFolderAndSave(String folderName, Folder parentFolder, Project project) {
        Folder folder = Folder.of(folderName, parentFolder, project);
        folderRepository.save(folder);
        return folder;
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

    // 보안을 위해 압축 파일 경로를 보호하는 메서드
    private Path zipSlipProtect(ZipEntry zipEntry, Path targetDir) throws IOException {
        Path targetDirResolved = targetDir.resolve(zipEntry.getName());
        Path normalizePath = targetDirResolved.normalize();
        if (!normalizePath.startsWith(targetDir)) {
            throw new IOException("Zip entry is outside of the target dir: " + zipEntry.getName());
        }
        return normalizePath;
    }

    // 이미지 파일인지 확인하는 메서드
    private boolean isImageFile(File file) {
        String fileName = file.getName().toLowerCase();
        return fileName.endsWith(".jpg") || fileName.endsWith(".png") || fileName.endsWith(".jpeg");
    }

    private String getExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1); // 파일 확장자
    }

    /**
     * 프로젝트 조회( 읽기 조회 트랜잭션 적용 )
     */
    @Transactional(readOnly = true)
    public Project getProject(Integer projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));
    }

    /**
     * 폴더 조회 ( 읽기 조회 트랜잭션 적용 )
     */
    @Transactional(readOnly = true)
    public Folder getFolder(final Integer folderId) {
        return folderRepository.findById(folderId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

    // 이미지 가져오면서 프로젝트 소속 여부를 확인
    private Image getImageByIdAndFolderIdAndFolderProjectId(final Integer folderId, final Long imageId, final Integer projectId) {
        return imageRepository.findByIdAndFolderIdAndFolderProjectId(imageId, folderId, projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
    }

    /*
            공통 로직
     */

    /**
     * MultipartFile 업로드 및 저장
     */
    private void uploadAndSave(MultipartFile file, Folder folder, int projectId) {
        try {
            String key = uploadToS3(file, projectId);
            saveImage(file, key, folder);
        } catch (Exception e) {
            log.error("파일 업로드 중 오류 발생", e);
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE, "이미지 업로드 중 오류 발생");
        }
    }

    /**
     * File 업로드 및 저장
     */
    private void uploadAndSave(File file, Folder folder, Project project) {
        try {
            String key = uploadToS3(file, project.getId());
            saveImage(file, key, folder);
        } catch (Exception e) {
            log.error("파일 업로드 중 오류 발생", e);
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE, "이미지 업로드 중 오류 발생");
        }
    }

    /**
     * DB에 이미지 정보 저장(트랜잭션 적용)
     */
    public void saveImage(final MultipartFile file, final String key, final Folder folder) {
        try {
            Image image = createImage(file, key, folder);
            imageRepository.save(image);
        } catch (Exception e) {
            log.error("이미지 DB 저장 실패 원인: ", e);
            s3UploadService.deleteImageFromS3(key); // DB 저장 실패시 S3에서 파일 삭제
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE, "이미지 DB 저장 중 실패");
        }
    }

    /**
     * DB에 이미지 정보 저장(트랜잭션 적용)
     */
    public void saveImage(final File file, final String key, final Folder folder) {
        try {
            Image image = createImage(file, key, folder);
            imageRepository.save(image);
        } catch (Exception e) {
            s3UploadService.deleteImageFromS3(key);
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE, "에러 발생");
        }
    }

    /**
     * S3 파일 업로드
     */
    private String uploadToS3(final MultipartFile file, final Integer projectId) {
        String extension = getExtension(file.getOriginalFilename());
        return s3UploadService.uploadMultipartFile(file, extension, projectId);
    }

    /**
     * S3 파일 업로드
     */
    private String uploadToS3(final File file, final Integer projectId) {
        String extension = getExtension(file.getName());
        return s3UploadService.uploadFile(file, extension, projectId);
    }

    public Image createImage(MultipartFile file, String key, Folder folder) {
        String extension = getExtension(file.getOriginalFilename());
        log.debug("이미지 업로드 이름 :{}",file.getOriginalFilename());
        return Image.of(file.getOriginalFilename(), key, extension, folder);
    }

    public Image createImage(File file, String key, Folder folder) {
        String extension = getExtension(file.getName());
        return Image.of(file.getName(), key, extension, folder);
    }
}
