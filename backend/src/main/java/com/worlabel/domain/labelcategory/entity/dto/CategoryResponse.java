package com.worlabel.domain.labelcategory.entity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Schema(name = "카테고리 응답 DTO", description = "프로젝트 내 카테고리 종류 응답 DTO")
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CategoryResponse {

    @Schema(description = "카테고리 ID", example = "1")
    private Integer id;

    @Schema(description = "라벨링 이름", example = "사람")
    private String labelName;

    public static CategoryResponse of(final Integer id, final String labelName) {
        return new CategoryResponse(id, labelName);
    }
}