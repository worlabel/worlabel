package com.worlabel.domain.image.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.worlabel.domain.folder.entity.Folder;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "project_image")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Image extends BaseEntity {

    /**
     * 프로젝트 이미지 ID
     */
    @Id
    @Column(name = "project_image_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 이미지 제목
     */
    @Column(name = "image_title", nullable = false, length = 255)
    private String title;

    /**
     * 이미지 주소 key
     */
    @Column(name = "image_key", nullable = false, length = 255)
    private String imageKey;

    /**
     * 이미지 확장자
     */
    @Column(name = "image_extenstion", nullable = false, length = 10)
    private String extension;

    /**
     * 이미지 레이블링 상태
     */
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private LabelStatus status = LabelStatus.PENDING;

    /**
     * 속한 폴더
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id", nullable = true)
    @JsonIgnore
    private Folder folder;

    private Image(final String imageTitle, final String imageKey, final String extension, final Folder folder) {
        this.title = imageTitle;
        this.imageKey = imageKey;
        this.extension = extension;
        this.folder = folder;
    }

    public static Image of(final String imageTitle, final String imageKey, final String extension, final Folder folder) {
        return new Image(imageTitle, imageKey, extension, folder);
    }

    public void moveFolder(final Folder moveFolder) {
        this.folder = moveFolder;
    }

    public void updateStatus(final LabelStatus labelStatus) {
        this.status = labelStatus;
    }

    public String getImagePath() {
        return this.imageKey + "." + this.extension;
    }

    public String getDataPath() {
        return this.imageKey + ".json";
    }
}
