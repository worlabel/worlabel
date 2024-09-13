package com.worlabel.domain.category.entity;


import com.worlabel.domain.project.entity.Project;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "label_category")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LabelCategory {

    /**
     * 레이블 카테고리 PK
     */
    @Id
    @Column(name = "label_category_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 레이블 카테고리 이름
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * 속한 프로젝트
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    private LabelCategory(final String name,final Project project) {
        this.name = name;
        this.project = project;
    }

    public static LabelCategory of(final String title, final Project project) {
        return new LabelCategory(title, project);
    }
}
