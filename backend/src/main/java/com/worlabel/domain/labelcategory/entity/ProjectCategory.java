package com.worlabel.domain.labelcategory.entity;

import com.worlabel.domain.model.entity.AIModel;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "project_category")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectCategory extends BaseEntity {

    /**
     * 레이블 카테고리 PK
     */
    @Id
    @Column(name = "label_category_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 레이블 카테고리
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "label_category_id", nullable = false)
    private LabelCategory labelCategory;

    /**
     * 프로젝트
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    private ProjectCategory(LabelCategory labelCategory, Project project) {
        this.labelCategory = labelCategory;
        this.project = project;
    }

    public static ProjectCategory of(LabelCategory labelCategory, Project project) {
        return new ProjectCategory(labelCategory, project);
    }
}
