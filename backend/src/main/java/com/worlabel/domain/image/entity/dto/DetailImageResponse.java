package com.worlabel.domain.image.entity.dto;

import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.image.entity.LabelStatus;
import com.worlabel.domain.label.entity.Label;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Schema(name = "이미지 상세조회 응답 DTO", description = "이미지 단건 조회 대한 응답 DTO")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class DetailImageResponse {

    @Schema(description = "이미지 ID", example = "1")
    private Long id;

    @Schema(description = "이미지 파일 제목", example = "image.jpg")
    private String imageTitle;

    @Schema(description = "이미지 경로", example = "https://worlabel-file-bucket.s3.ap-northeast-2.amazonaws.com/1/78380973-ac70.jpg")
    private String imageUrl;

    @Schema(description = "폴리곤 데이터", example = "PENDING 상태라면 data null")
    private String data;

    @Schema(description = "이미지 상태", example = "PENDING")
    private LabelStatus status;

    public static DetailImageResponse from(final Image image, final String data) {
        return new DetailImageResponse(
                image.getId(),
                image.getTitle(),
                image.getImagePath(),
                data,
                image.getStatus()
        );
    }
}
