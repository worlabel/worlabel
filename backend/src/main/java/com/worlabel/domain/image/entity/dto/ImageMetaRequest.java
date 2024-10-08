package com.worlabel.domain.image.entity.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Schema(name = "이미지 PreSigned DTO", description = "PreSigned Url을 얻기 위한 DTO")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ImageMetaRequest {

    @Schema(description = "이미지 Order", example = "각 이미지에 대한 Order값")
    private Integer id;

    @Schema(description = "파일 이름", example = "해당 파일의 이름")
    private String fileName;
}
