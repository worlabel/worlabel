package com.worlabel.domain.image.entity.dto;

import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.entity.LabelStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Schema(name = "이미지 목록 응답 DTO", description = "폴더 내 이미지에 대한 응답 DTO")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ImageResponse {

    @Schema(description = "이미지 ID", example = "1")
    private Long id;

    @Schema(description = "이미지 파일 제목", example = "image.jpg")
    private String imageTitle;

    @Schema(description = "이미지 상태", example = "PENDING")
    private LabelStatus status;

    @Schema(description = "이미지 주소", example = "https://abc.jpg")
    private String imagePath;

    @Schema(description = "이미지 데이터 주소", example = "https://abc.json")
    private String dataPath;

    public static ImageResponse from(final Image image) {
        return new ImageResponse(
                image.getId(),
                image.getTitle(),
                image.getStatus(),
                image.getImagePath(),
                image.getDataPath()
        );
    }
}