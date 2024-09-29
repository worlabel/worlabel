package com.worlabel.domain.image.service;

import com.worlabel.domain.folder.entity.Folder;
import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.repository.ImageRepository;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import com.worlabel.global.service.S3UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageAsyncService {

    private final S3UploadService s3UploadService;
    private final ImageRepository imageRepository;
    private final ThreadPoolTaskExecutor imageUploadExecutor;

    @Transactional
    @Async("imageUploadExecutor")
    public CompletableFuture<Void>  asyncImageUpload(final List<MultipartFile> imageList, final Folder folder, final Integer projectId) {
        log.debug("현재 스레드 - {} 업로드 파일 개수 - {}, 현재 작업 큐 용량 - {}",
                Thread.currentThread().getName(),
                imageList.size(),
                imageUploadExecutor.getThreadPoolExecutor().getQueue().size()); // 큐에 쌓인 작업 수 출력);

        imageList.forEach(file -> {
            try{
                String extension = getExtension(file.getOriginalFilename());
                String imageKey = s3UploadService.uploadImageFile(file, extension, projectId);

                createImage(file, imageKey, folder);
            }catch (Exception e){
                log.error("이미지 업로드 실패: {}", file.getOriginalFilename(), e);
                throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE);
            }
        });

        log.debug("배치 처리 완료");
        return CompletableFuture.completedFuture(null);
    }

    public void createImage(MultipartFile file, String imageKey, Folder folder) {
        try {
            String name = file.getOriginalFilename();
            String extension = getExtension(name);
            Image image = Image.of(name, imageKey, extension, folder);
            imageRepository.save(image);
        }catch (Exception e){
            log.debug("이미지 DB 저장 실패: ", e);
            s3UploadService.deleteImageFromS3(imageKey);
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE);
        }
    }

    private String getExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }
}
