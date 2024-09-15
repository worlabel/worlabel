package com.worlabel.domain.review.entity;

import com.worlabel.domain.image.entity.Image;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Getter
@Table(name = "review_image")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReviewImage extends BaseEntity {

    /**
     * 라뷰 PK
     */
    @Id
    @Column(name = "review_image_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 속한 리뷰
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Review review;

    /**
     * 속한 이미지
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "image_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Image image;

    private ReviewImage(final Review review, final Image image) {
        this.review = review;
        this.image = image;
    }

    public static ReviewImage of(final Review review, final Image image) {
        return new ReviewImage(review, image);
    }
}
