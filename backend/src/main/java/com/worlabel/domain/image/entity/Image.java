package com.worlabel.domain.image.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.worlabel.domain.folder.entity.Folder;
import com.worlabel.domain.label.entity.Label;
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
     * 이미지 URL
     */
    @Column(name = "image_url", nullable = false, length = 255)
    private String imageUrl;

    /**
     * 이미지 순서
     */
    @Column(name = "image_order", nullable = false)
    private Integer order;

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
    @JoinColumn(name = "folder_id", nullable = false)
    @JsonIgnore
    private Folder folder;

    /**
     * 이미지에 연결된 레이블
     */
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "image", cascade = CascadeType.ALL, orphanRemoval = true)
    private Label label;

    private Image(final String imageTitle, final String imageUrl, final Integer order, final Folder folder) {
        this.title = imageTitle;
        this.imageUrl = imageUrl;
        this.order = order;
        this.folder = folder;
    }

    public static Image of(final String imageTitle, final String imageUrl, final Integer order, final Folder folder) {
        return new Image(imageTitle, imageUrl, order, folder);
    }

    public void moveFolder(final Folder moveFolder) {
        this.folder = moveFolder;
    }

    public void updateStatus(final LabelStatus labelStatus) {
        this.status = labelStatus;
    }
}
