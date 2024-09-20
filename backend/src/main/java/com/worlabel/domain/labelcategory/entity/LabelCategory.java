package com.worlabel.domain.labelcategory.entity;


import com.worlabel.domain.model.entity.AIModel;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "label_category")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LabelCategory extends BaseEntity {

    /**
     * 레이블 카테고리 PK
     */
    @Id
    @Column(name = "label_category_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 속한 모델
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", nullable = false)
    private AIModel aiModel;

    /**
     * 레이블 카테고리 이름
     */
    @Column(name = "label_category_name", nullable = false)
    private String name;

    /**
     * 실제 AI 모델의 ai 카테고리 id
     */
    @Column(name = "ai_category_id", nullable = false)
    private Integer aiCategoryId;

    private LabelCategory(final AIModel aiModel, final String name, final int aiCategoryId) {
        this.aiModel = aiModel;
        this.name = name;
        this.aiCategoryId = aiCategoryId;
    }

    public static LabelCategory of(final AIModel aiModel, final String name, final int aiCategoryId) {
        return new LabelCategory(aiModel, name, aiCategoryId);
    }
}
