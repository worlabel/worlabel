package com.worlabel.domain.label.entity.dto;

import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.project.entity.ProjectType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Schema(name = "오토 레이블링 요청 dto", description = "오토 레이블링 요청 DTO")
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Getter
public class ImageRequest {

    @Schema(description = "이미지 PK", example = "2")
    @NotEmpty(message = "이미지 PK를 입력하세요")
    private Long id;
    
    // TODO: Title 들어가야 함
//    @Schema(description = "이미지 PK", example = "2")
//    @NotEmpty(message = "이미지 PK를 입력하세요")
//    private String title;

    @Schema(description = "프로젝트 유형", example = "classification")
    @NotNull(message = "카테고리를 입력하세요.")
    private ProjectType projectType;

    public static ImageRequest of(Image image, ProjectType projectType){
        return new ImageRequest(image.getId(), projectType);
    }
}
