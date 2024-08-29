package com.worlabel.domain.project.entity.dto;

import com.worlabel.domain.project.entity.ProjectType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Schema(name = "프로젝트 요청 dto", description = "프로젝트 요청 DTO")
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
public class ProjectRequest {

    @Schema(description = "프로젝트 제목", example = "삼성 갤럭시 s23")
    @NotEmpty(message = "제목을 입력하세요.")
    private String title;

    @Schema(description = "프로젝트 유형", example = "classification")
    @NotNull(message = "카테고리를 입력하세요.")
    private ProjectType projectType;
}
