package com.worlabel.domain.folder.entity.dto;

import com.worlabel.domain.folder.entity.Folder;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Schema(name = "폴더 ID 응답 DTO", description = "하위 폴더의 ID만 포함하는 DTO")
@Getter
@AllArgsConstructor
public class FolderIdResponse {

    @Schema(description = "폴더 ID", example = "1")
    private Integer id;

    @Schema(description = "폴더 이름", example = "car")
    private String title;

    public static FolderIdResponse from(final Folder folder) {
        return new FolderIdResponse(folder.getId(), folder.getTitle());
    }
}