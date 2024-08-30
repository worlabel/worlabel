package com.worlabel.domain.folder.entity.dto;

import com.worlabel.domain.image.entity.Image;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Schema(name = "이미지 응답 DTO", description = "폴더 내 이미지에 대한 응답 DTO")
@Getter
@AllArgsConstructor
public class ImageResponse {

    @Schema(description = "이미지 ID", example = "1")
    private Long id;

    @Schema(description = "이미지 URL", example = "https://example.com/image.jpg")
    private String imageUrl;

    public static ImageResponse from(final Image image) {
        return new ImageResponse(
                image.getId(),
                image.getImageUrl()
        );
    }
}