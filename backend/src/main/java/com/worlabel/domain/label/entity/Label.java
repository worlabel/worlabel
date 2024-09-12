package com.worlabel.domain.label.entity;

import com.worlabel.domain.image.entity.Image;
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

    public static Label of(String jsonUrl, Image image) {
        Label label = new Label();
        label.url = jsonUrl;
        label.image = image;
        return label;
    }

    public void changeUrl(String newUrl){

    }
}
