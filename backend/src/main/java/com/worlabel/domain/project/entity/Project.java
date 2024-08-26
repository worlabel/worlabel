package com.worlabel.domain.project.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.worlabel.domain.workspace.entity.Workspace;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name = "project")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Project extends BaseEntity {

    /**
     * 프로젝트 ID
     */
    @Id
    @Column(name = "project_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 프로젝트 제목
     */
    @Column(name = "title", length = 50)
    private String title;

    /**
     * 소속된 워크 스페이스
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    @JsonIgnore
    private Workspace workspace;

    /**
     * 사용하는 레이블 카테고리
     */
    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LabelCategory> labelCategoryList = new ArrayList<>();
}
