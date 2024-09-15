package com.worlabel.domain.image.entity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Schema(name = "레이블 저장 DTO", description = "레이블 저장을 위한 DTO")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ImageLabelRequest {
    @Schema(description = "레이블 데이터", example = "레이블 데이터 양식 json 파일 형태")
    private String data;
}
