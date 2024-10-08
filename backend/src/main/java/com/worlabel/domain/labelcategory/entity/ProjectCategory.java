package com.worlabel.domain.labelcategory.entity;

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
    @Column(name = "project_category_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Model name
     */
    @Column(name = "label_category_name", length = 50)
    private String labelName;

    /**
     * 프로젝트
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    private ProjectCategory(String labelName, Project project) {
        this.labelName = labelName;
        this.project = project;
    }

    public static ProjectCategory of(String labelName, Project project) {
        return new ProjectCategory(labelName, project);
    }
}
