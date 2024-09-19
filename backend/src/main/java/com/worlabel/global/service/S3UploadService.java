package com.worlabel.global.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

// TODO: 추후 비동기로 변경해야합니다.
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

    public void uploadJson(final String json, final String dataUrl) {
        String key = getKeyFromImageAddress(dataUrl);

        try {
            byte[] jsonBytes = json.getBytes(StandardCharsets.UTF_8);
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("application/json");
            metadata.setContentLength(jsonBytes.length);

            // JSON 데이터를 S3에 업로드
            try (ByteArrayInputStream inputStream = new ByteArrayInputStream(jsonBytes)) {
                PutObjectRequest putRequest = new PutObjectRequest(bucket, key, inputStream, metadata);
                amazonS3.putObject(putRequest); // S3에 파일 업로드
            }
        } catch (Exception e) {
            log.error("JSON 업로드 중 오류 발생: ", e);
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE);
        }
    }

    public String getData(final String dataUrl) {
        try {
            // S3 URL에서 Key 추출
            String key = getKeyFromImageAddress(dataUrl);

            // S3에서 객체 가져오기
            S3Object object = amazonS3.getObject(bucket, key);

            // S3 객체의 내용을 스트림으로 읽어오기
            String data = readS3ObjectContent(object.getObjectContent());
            log.debug("object Content: {}", data);

            return data;
        } catch (Exception e) {
            return null;
        }
    }

    private String readS3ObjectContent(InputStream inputStream) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            return reader.lines().collect(Collectors.joining("\n"));
        }
    }

    /**
     * 파일이 존재하는지 확인
     */
    public String upload(final MultipartFile image, final String extension, final Integer projectId) {
        if (image.isEmpty() || Objects.isNull(image.getOriginalFilename())) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }
        return url + "/" + uploadImage(image, extension, projectId);
    }

    /**
     * 파일 업로드
     */
    private String uploadImage(final MultipartFile image, final String extension, final Integer projectId) {
        try {
            return uploadImageToS3(image, extension, projectId);
        } catch (IOException e) {
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE);
        }
    }

    /**
     * AWS S3 이미지 업로드
     */
    private String uploadImageToS3(final MultipartFile image, final String extension, final Integer projectId) throws IOException {
        // UUID를 사용하여 고유한 파일 이름 생성
        String s3Key = getS3FileName(projectId);
        String s3FileName = s3Key + "." + extension;
        log.debug("{}", s3FileName);

        // MultipartFile의 InputStream을 가져온 뒤, 바이트 배열로 변환
        byte[] bytes = IOUtils.toByteArray(image.getInputStream());

        ObjectMetadata metadata = new ObjectMetadata(); // S3에 업로드할 파일의 메타데이터 설정
        metadata.setContentType("image/" + extension); // 콘텐츠 타입 설정
        metadata.setContentLength(bytes.length); // 콘텐츠 길이 설정

        // 바이트 배열을 사용하여 ByteArrayInputStream 생성
        try (ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes)) {
            // S3에 파일 업로드 요청 생성
            PutObjectRequest putRequest = new PutObjectRequest(bucket, s3FileName, byteArrayInputStream, metadata);

            amazonS3.putObject(putRequest); // S3 파일 업로드
        } catch (Exception e) {
            log.error("", e);
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE);
        }
        return s3Key;
    }

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

    private String removeExtension(String url) {
        if (!StringUtils.hasText(url) || !url.contains(".")) {
            return url;
        }
        return url.substring(0, url.lastIndexOf("."));
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

    public String uploadFromInputStream(InputStream inputStream, String extension, Integer projectId, String fileName) {
        try {
            String s3Key = getS3FileName(projectId);
            String s3FileName = s3Key + "." + extension;

            byte[] bytes = IOUtils.toByteArray(inputStream);

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("image/" + extension);
            metadata.setContentLength(bytes.length);

            try (ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes)) {
                PutObjectRequest putRequest = new PutObjectRequest(bucket, s3FileName, byteArrayInputStream, metadata);
                amazonS3.putObject(putRequest);
            }

            return s3Key;
        } catch (IOException e) {
            throw new CustomException(ErrorCode.FAIL_TO_CREATE_FILE);
        }
    }
}
