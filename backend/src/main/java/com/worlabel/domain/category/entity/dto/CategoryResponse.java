package com.worlabel.domain.category.entity.dto;

import com.worlabel.domain.category.entity.LabelCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Schema(name = "카테고리 응답 DTO", description = "카테고리 조회 응답 DTO")
public class CategoryResponse {

    @Schema(description = "카테고리 ID", example = "1")
    private Integer id;

    @Schema(description = "카테고리 이름", example = "Car")
    private String name;

    public static CategoryResponse from(LabelCategory labelCategory) {
        return new CategoryResponse(labelCategory.getId(), labelCategory.getName());
    }
}
