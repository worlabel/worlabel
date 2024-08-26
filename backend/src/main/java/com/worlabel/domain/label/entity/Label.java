package com.worlabel.domain.label.entity;

import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.project.entity.LabelCategory;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "label")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Label extends BaseEntity {

    /**
     * 레이블 PK
     */
    @Id
    @Column(name ="label_id",nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 레이블 파일 URL
     */
    @Column(name = "label_url",nullable = true,length = 255)
    private String url;

    /**
     * 속한 이미지
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "image_id")
    private Image image;

    /**
     * 속한 카테고리
     * TODO: 한 레이블 카테고리에 속한걸 찾는데에 Json파일에 담기 때문에 카테고리는 Label Entity에 없어도 될 것 같음
     */
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "label_category_id")
//    private LabelCategory labelCategory;
}
