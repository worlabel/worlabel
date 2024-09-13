package com.worlabel.domain.category.entity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Schema(name = "카테고리 요청 DTO", description = "카테고리 생성 및 수정을 위한 요청 DTO")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {

    @Schema(description = "카테고리 이름", example = "Car")
    private String categoryName;
}
