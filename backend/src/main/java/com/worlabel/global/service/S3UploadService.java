package com.worlabel.global.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.util.IOUtils;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3UploadService {

    /**
     * S3 버킷 이름
     */
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    /**
     * S3 인스턴스
     */
    private final AmazonS3 amazonS3;

    /**
     * prefix 주소
     */
    @Value("${cloud.aws.url}")
    private String url;


    /**
     * 파일이 존재하는지 확인
     */
    public String upload(MultipartFile image) {
        if (image.isEmpty() || Objects.isNull(image.getOriginalFilename())) {
            throw new CustomException(ErrorCode.EMPTY_FILE);
        }
        return url + uploadImage(image);
    }

    /**
     * 파일 업로드
     */
    private String uploadImage(MultipartFile image) {
        try {
            return uploadToS3(image);
        } catch (IOException e) {
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE);
        }
    }

    /**
     * AWS S3 이미지 업로드
     */
    private String uploadToS3(MultipartFile image) throws IOException {
        String originalFileName = image.getOriginalFilename(); // 원본 파일 이름
        String extension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1); // 파일 확장자

        // UUID를 사용하여 고유한 파일 이름 생성
        String s3FileName = UUID.randomUUID().toString().substring(0, 14);

        // MultipartFile의 InputStream을 가져온 뒤, 바이트 배열로 변환
        byte[] bytes = IOUtils.toByteArray(image.getInputStream());

        ObjectMetadata metadata = new ObjectMetadata(); // S3에 업로드할 파일의 메타데이터 설정
        metadata.setContentType("image/" + extension); // 콘텐츠 타입 설정
        metadata.setContentLength(bytes.length); // 콘텐츠 길이 설정

        log.debug("metadata : {}",metadata);
        // 바이트 배열을 사용하여 ByteArrayInputStream 생성
        try (ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes)) {
            // S3에 파일 업로드 요청 생성
            PutObjectRequest putRequest = new PutObjectRequest(bucket, s3FileName, byteArrayInputStream, metadata);
            log.debug("요청 : {}",putRequest);
            amazonS3.putObject(putRequest); // S3 파일 업로드
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE);
        }
        URL url = amazonS3.getUrl(bucket, s3FileName);
        log.debug("url :{}",url);
        return url.getPath();
    }
}
