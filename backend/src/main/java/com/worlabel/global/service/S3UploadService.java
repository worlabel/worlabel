package com.worlabel.global.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

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
     * Json 업로드
     */
    public void uploadJson(final String json, final String dataUrl) {
        String key = getKeyFromImageAddress(dataUrl);
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType("application/json");

        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8))) {
            uploadToS3(inputStream, key, metadata);
        } catch (Exception e) {
            log.error("JSON 업로드 중 오류 발생: ", e);
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE);
        }
    }


    /**
     * MultipartFile 업로드
     */
    public String uploadImageFile(final MultipartFile file, final String extension, final Integer projectId) {
        try (InputStream inputStream = file.getInputStream()) {
            return uploadImageToS3(inputStream, extension, projectId);
        } catch (IOException e) {
            log.debug("MultipartFile 업로드 에러 발생 {}",file.getOriginalFilename(), e);
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE);
        }
    }

    /**
     * AWS S3 이미지 업로드
     */

    public String uploadImageToS3(final InputStream inputStream, final String extension, final Integer projectId) throws IOException {
        String s3Key = getS3FileName(projectId);
        String s3FileName = s3Key + "." + extension;

        ObjectMetadata metadata = new ObjectMetadata(); // S3에 업로드할 파일의 메타데이터 설정
        metadata.setContentType("image/" + extension); // 콘텐츠 타입 설정
        metadata.setContentLength(inputStream.available());

        PutObjectRequest putRequest = new PutObjectRequest(bucket, s3FileName, inputStream, metadata);
        amazonS3.putObject(putRequest);

        return url + "/" + s3Key;
    }

    /**
     * File 업로드
     */
    public String uploadImageFile(final File file, final String extension, final Integer projectId) {
        try (InputStream inputStream = new FileInputStream(file)) {
            return uploadImageToS3(inputStream, extension, projectId);
//            return "";
        } catch (IOException e) {
            log.debug("이미지 업로드에서 에러 발생 ", e);
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE);
        }
    }


    /**
     * InputStream 사용해서 파일을 S3 업로드
     */
    public void uploadToS3(InputStream inputStream, final String s3Key, final ObjectMetadata metadata) {
        try {
            byte[] bytes = IOUtils.toByteArray(inputStream);

            metadata.setContentLength(bytes.length); // 메타데이터 파일 크기 설정
            try (ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes)) {
                PutObjectRequest putRequest = new PutObjectRequest(bucket, s3Key, byteArrayInputStream, metadata);
                amazonS3.putObject(putRequest); // S3 파일 업로드
            }
        } catch (IOException e) {
            log.error("S3 업로드 중 오류 발생", e);
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE);
        }
    }

    /**
     * S3에서 이미지 삭제
     */
    public void deleteImageFromS3(String imageAddress) {
        String key = getKeyFromImageAddress(imageAddress);
        try {
            amazonS3.deleteObject(new DeleteObjectRequest(bucket, key));
        } catch (Exception e) {
            throw new CustomException(ErrorCode.FAIL_TO_DELETE_FILE);
        }
    }

    private static String getS3FileName(final Integer projectId) {
        return projectId + "/" + UUID.randomUUID().toString().substring(0, 13);
    }

    private String getKeyFromImageAddress(String imageAddress) {
        if (!StringUtils.hasText(imageAddress)) {
            throw new CustomException(ErrorCode.INVALID_FILE_PATH);
        }

        try {
            URL url = new URL(imageAddress);
            String decodingKey = URLDecoder.decode(url.getPath(), StandardCharsets.UTF_8);
            return decodingKey.substring(1);
        } catch (MalformedURLException e) {
            throw new CustomException(ErrorCode.INVALID_FILE_PATH);
        }
    }
}
