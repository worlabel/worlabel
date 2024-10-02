package com.worlabel.domain.image.entity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Schema(name = "이미지 PreSigned DTO", description = "PreSigned Url을 얻기 위한 DTO")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ImagePresignedUrlResponse {

    @Schema(description = "이미지 Order", example = "각 이미지에 대한 Order값")
    private Integer id;

    @Schema(description = "이미지에 대한 presignedUrl", example = "presignedUrl")
    private String presignedUrl;

    public static ImagePresignedUrlResponse of(final Integer id,final String presignedUrl) {
        return new ImagePresignedUrlResponse(id, presignedUrl);
    }
}
