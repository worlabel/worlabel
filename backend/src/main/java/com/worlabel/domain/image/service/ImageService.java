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
import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveInputStream;
import org.apache.commons.compress.utils.IOUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Stream;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ImageService {

    private final ProjectRepository projectRepository;
    private final ImageAsyncService imageAsyncService;
    private final FolderRepository folderRepository;
    private final S3UploadService s3UploadService;
    private final ImageRepository imageRepository;

    /**
     * 이미지 리스트 업로드
     */
    @CheckPrivilege(value = PrivilegeType.EDITOR)
    public void uploadImageList(final List<MultipartFile> imageList, final Integer folderId, final Integer projectId) {
        Folder folder = getOrCreateFolder(folderId, projectId);
        folderRepository.flush();

        log.debug("folder Id {}, Project Id {}",folder.getId(), folder.getProject().getId());
        long prev = System.currentTimeMillis();

        // 동적 배치 크기 계산
        int totalImages = imageList.size();
        int batchSize;

        if (totalImages <= 100) {
            batchSize = 25;  // 작은 이미지 수는 작은 배치 크기
        } else if (totalImages <= 3000) {
            batchSize = 50;  // 중간 이미지 수는 중간 배치 크기
        } else {
            batchSize = 100; // 큰 이미지 수는 큰 배치 크기
        }

        List<CompletableFuture<Void>> futures = new ArrayList<>();
        for (int i = 0; i < imageList.size(); i += batchSize) {
            List<MultipartFile> batch = imageList.subList(i, Math.min(i + batchSize, imageList.size()));

            CompletableFuture<Void> future = imageAsyncService.asyncImageUpload(batch, folder, projectId);
            // 모든 비동기 작업이 완료될 때까지 기다림
            futures.add(future);
        }

        // 모든 비동기 작업이 완료될 때까지 기다림
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        long after = System.currentTimeMillis();
        log.debug("업로드 완료 - 경과시간 {}", ((double) after - prev) / 1000);
    }

    /**
     * Zip 파일 처리 메서드
     */
    @CheckPrivilege(PrivilegeType.EDITOR)
    public void uploadFolderWithImages(final MultipartFile zipFile, final Integer projectId, final Integer folderId) throws IOException {
        log.debug("파일 크기: {}, 기존 파일 이름: {} ", zipFile.getSize(), zipFile.getOriginalFilename());

        Path tmpDir = null;
        try {
            String originalFilename = zipFile.getOriginalFilename();
            if (originalFilename == null || !originalFilename.endsWith(".zip")) {
                throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE, "ZIP 파일만 업로드 가능");
            }

            // ZIP 파일 처리
            String zipFolderName = originalFilename.substring(0, originalFilename.lastIndexOf("."));
            tmpDir = Files.createTempDirectory(zipFolderName);

            Project project = getProject(projectId);
            Folder rootFolder = getOrCreateFolder(folderId, projectId);

            unzip(zipFile, tmpDir.toString());
            processFolderRecursively(tmpDir.toFile(), rootFolder, project);
        } finally {
            if (tmpDir != null) {
                deleteDirectoryRecursively(tmpDir);
                log.debug("임시 디렉토리 삭제 완료: {}", tmpDir);
            }
        }
    }

    private void deleteDirectoryRecursively(Path directory) throws IOException {
        if (Files.exists(directory)) {
            try (Stream<Path> paths = Files.walk(directory)) {
                paths.sorted(Comparator.reverseOrder()) // 하위 파일부터 삭제
                        .forEach(path -> {
                            try {
                                Files.delete(path);
                            } catch (IOException e) {
                                log.error("Failed to delete file: {}", path, e);
                            }
                        });
            }
        }
    }

    /**
     * 폴더 및 파일을 재귀적으로 탐색하여 처리
     */
    private void processFolderRecursively(File directory, Folder parentFolder, Project project) {
        log.debug("폴더 이름 {}, 부모 폴더 이름 {}", directory.getName(), parentFolder == null ? "root" : parentFolder.getTitle());

        if (directory.exists() && directory.isDirectory()) {
            File[] files = directory.listFiles();
            if (files != null) {
                for (File file : files) {
                    // 숨겨진 파일이나 __MACOSX 폴더를 제외
                    if (file.getName().startsWith("._") || file.getName().contains("__MACOSX")) {
                        log.debug("숨겨진 파일이나 __MACOSX 폴더 제외: {}", file.getName());
                        continue;
                    }

                    if (file.isDirectory()) {
                        Folder currentFolder = createFolderAndSave(file.getName(), parentFolder, project);
                        processFolderRecursively(file, currentFolder, project);
                    } else if (isImageFile(file)) {
                        log.debug("파일 {}", file.getName());
                        uploadAndSave(file, parentFolder, project);
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

    // Apache Commons Compress 라이브러리를 사용하여 ZIP 파일을 처리
    private void unzip(MultipartFile zipFile, String destDir) throws IOException {
        log.debug("Unzip 시작 {} ", zipFile.getOriginalFilename());
        log.debug(System.getProperty("java.io.tmpdir"));

        try (ZipArchiveInputStream zis = new ZipArchiveInputStream(zipFile.getInputStream(), "MS949")) {
            ArchiveEntry entry;

            while ((entry = zis.getNextEntry()) != null) {
                ZipArchiveEntry zipEntry = (ZipArchiveEntry) entry;
                // 파일인지 확인한다.
                Path newPath = zipSlipProtect(zipEntry, Paths.get(destDir));

                // 디렉토리면 해당 디렉토리 이름으로 생성
                if (zipEntry.isDirectory()) {
                    Files.createDirectories(newPath);
                }
                // 파일이면 이름을 기반으로 부모 폴더를 찾고 저장한다.
                else {
                    Files.createDirectories(newPath.getParent());
                    try (OutputStream os = Files.newOutputStream(newPath)) {
                        IOUtils.copy(zis, os);
                    }
                }
            }
        }
    }

    // 보안을 위해 압축 파일 경로를 보호하는 메서드
    private Path zipSlipProtect(ZipArchiveEntry zipEntry, Path targetDir) throws IOException {
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

    /**
     * 폴더 생성 또는 가져오기
     * 폴더 생성 작업이 있음으로 트랜잭션 보호
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
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
    public void uploadAndSave(MultipartFile file, Folder folder, int projectId) {
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
    public void uploadAndSave(File file, Folder folder, Project project) {
        try {
            String key = uploadToS3(file, project.getId());
            log.debug("업로드 {}", key);
            saveImage(file, key, folder);
        } catch (Exception e) {
            log.error("", e);
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE, "이미지 업로드 중 오류 발생");
        }
    }

    /**
     * DB에 이미지 정보 저장(트랜잭션 적용)
     */
    public void saveImage(final MultipartFile file, final String key, final Folder folder) {
        try {
            Image image = createImage(file.getOriginalFilename(), key, folder);
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
            log.debug("파일 생성 완료 : {} {}", file.getName(), key);
            Image image = createImage(file.getName(), key, folder);
            imageRepository.save(image);
        } catch (Exception e) {
            log.error("error ", e);
            s3UploadService.deleteImageFromS3(key);
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE, "에러 발생");
        }
    }

    /**
     * S3 파일 업로드
     */
    public String uploadToS3(final MultipartFile file, final Integer projectId) {
        String extension = getExtension(file.getOriginalFilename());
        return s3UploadService.uploadImageFile(file, extension, projectId);
    }

    /**
     * S3 파일 업로드
     */
    private String uploadToS3(final File file, final Integer projectId) {
        String extension = getExtension(file.getName());
        log.debug("S3에서 업로드 현황 {}, {}, {}", file.getName(), extension, file.getTotalSpace());
        return s3UploadService.uploadImageFile(file, extension, projectId);
    }

    public Image createImage(String fileName, String key, Folder folder) {
        String extension = getExtension(fileName);
        return Image.of(fileName, key, extension, folder);
    }
}
