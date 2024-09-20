package com.worlabel.domain.image.entity.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class FolderUploadRequest {

    private MultipartFile folder;  // 폴더를 압축 파일로 받을 수 있음 (zip 등)
}