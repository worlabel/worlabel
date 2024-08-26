package com.worlabel.domain.project.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
     * 카테고리 ID
     */
    @Id
    @Column(name = "label_category_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 레이블 카테고리 이름
     */
    @Column(name = "label_category_name",nullable = false,length = 50)
    private String name;

    /**
     * 사용되는 프로젝트
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnore
    private Project project;
}
