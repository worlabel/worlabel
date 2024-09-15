package com.worlabel.domain.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.worlabel.domain.image.entity.Image;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Schema(name = "오토 레이블링 요청 dto", description = "오토 레이블링 요청 DTO")
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AutoLabelingImageRequest {
    @Schema(description = "이미지 PK", example = "2")
    @NotEmpty(message = "이미지 PK를 입력하세요")
    @JsonProperty("image_id")
    private Long imageId;

    @Schema(description = "이미지 url", example = "image.png")
    @NotEmpty(message = "이미지 url을 입력하세요")
    @JsonProperty("image_url")
    private String imageUrl;

    public static AutoLabelingImageRequest of(Image image){
        return new AutoLabelingImageRequest(image.getId(), image.getImagePath());
    }
}
