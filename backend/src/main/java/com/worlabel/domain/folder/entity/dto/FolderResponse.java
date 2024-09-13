package com.worlabel.domain.folder.entity.dto;

import com.worlabel.domain.folder.entity.Folder;
import com.worlabel.domain.image.entity.LabelStatus;
import com.worlabel.domain.image.entity.dto.ImageResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Schema(name = "폴더 응답 DTO", description = "폴더 조회 응답 DTO")
@Getter
@AllArgsConstructor
public class FolderResponse {

    @Schema(description = "폴더 ID", example = "1")
    private Integer id;

    @Schema(description = "폴더 이름", example = "My Folder")
    private String title;

    @Schema(description = "폴더에 속한 이미지 목록")
    private List<ImageResponse> images;

    @Schema(description = "하위 폴더 목록")
    private List<FolderIdResponse> children;

    public static FolderResponse from(final Folder folder) {
        List<ImageResponse> images = folder.getImageList().stream()
                .map(ImageResponse::from)
                .toList();

        List<FolderIdResponse> children = folder.getChildren().stream()
                .map(FolderIdResponse::from)
                .toList();

        return new FolderResponse(
                folder.getId(),
                folder.getTitle(),
                images,
                children
        );
    }

    public static FolderResponse fromWithNeedReview(final Folder folder) {
        List<ImageResponse> images = folder.getImageList().stream()
                .filter(image -> image.getStatus() == LabelStatus.REVIEW_REQUEST)
                .map(ImageResponse::from)
                .toList();

        List<FolderIdResponse> children = folder.getChildren().stream()
                .map(FolderIdResponse::from)
                .toList();

        return new FolderResponse(
                folder.getId(),
                folder.getTitle(),
                images,
                children
        );
    }

    public static FolderResponse from(final List<Folder> topFolders) {
        List<FolderIdResponse> list = topFolders.stream()
                .map(FolderIdResponse::from)
                .toList();

        return new FolderResponse(0, "root", List.of(), list);
    }
}
