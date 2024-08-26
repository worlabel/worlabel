package com.worlabel.domain.folder.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.worlabel.domain.image.entity.Image;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name = "folder")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Folder extends BaseEntity {

    /**
     * 폴더 PK
     */
    @Id
    @Column(name = "folder_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 폴더 이름
     */
    @Column(name = "title",nullable = false)
    private String title;

    /**
     * 상위 폴더 
     * 없다면 최상위 폴더
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @JsonIgnore
    private Folder parent;

    /**
     * 하위 폴더 리스트
     */
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Folder> children = new ArrayList<>();

    /**
     * 폴더에 속한 이미지
     */
    @OneToMany(mappedBy = "folder", fetch = FetchType.LAZY, cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Image> imageList = new ArrayList<>();
}
