package com.worlabel.domain.folder.entity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Schema(name = "폴더 요청 DTO", description = "폴더 생성 및 수정을 위한 요청 DTO")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FolderRequest {

    @Schema(description = "폴더 이름", example = "My Folder")
    private String title;

    @Schema(description = "상위 폴더 ID", example = "1")
    private Integer parentId;
}