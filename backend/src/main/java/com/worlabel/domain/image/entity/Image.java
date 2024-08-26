package com.worlabel.domain.image.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.worlabel.domain.folder.entity.Folder;
import com.worlabel.domain.label.entity.Label;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name = "project_image")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Image extends BaseEntity {

    /**
     * 프로젝트 이미지 ID
     */
    @Id
    @Column(name = "project_image_id",nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 이미지 URL
     */
    @Column(name = "image_url", nullable = false,length=255)
    private String imageUrl;

    /**
     * 이미지 순서
     */
    @Column(name = "image_order", nullable = false)
    private Integer order;

    /**
     * 이미지 레이블링 상태
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status",nullable = false)
    private LabelStatus status = LabelStatus.Pending;

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
    @OneToOne(mappedBy = "image",cascade = CascadeType.ALL, orphanRemoval = true)
    private Label label;
}
