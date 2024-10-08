package com.worlabel.domain.review.entity;

import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.project.entity.Project;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

@Entity
@Getter
@Table(name = "review")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Review extends BaseEntity {

    /**
     * 라뷰 PK
     */
    @Id
    @Column(name = "review_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 라뷰 제목
     */
    @Column(name = "title", nullable = false)
    private String title;

    /**
     * 라뷰 내용
     */
    @Column(name = "content", nullable = false)
    private String content;

    /**
     * 속한 사용자
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    /**
     * 속한 프로젝트
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    /**
     * 리뷰 상태
     */
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ReviewStatus reviewStatus = ReviewStatus.REQUESTED;

    /**
     * Merge한 사람 (Reviewer)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = true)  // Merge 시점에 설정되므로 NULL 가능
    private Member reviewer;

    private Review(final String title,
                   final String content,
                   final Member member,
                   final Project project,
                   final ReviewStatus reviewStatus) {
        this.title = title;
        this.content = content;
        this.member = member;
        this.project = project;
        this.reviewStatus = reviewStatus;
    }

    public static Review of(final String title,
                            final String content,
                            final Member member,
                            final Project project,
                            final ReviewStatus reviewStatus) {
        return new Review(title, content, member, project, reviewStatus);
    }

    public void updateReview(final String title, final String content) {
        this.title = title;
        this.content = content;
    }

    public void updateReviewStatus(final ReviewStatus reviewStatus) {
        this.reviewStatus = reviewStatus;
    }

    // Merge한 사람을 설정하는 메서드
    public void assignReviewer(final Member reviewer) {
        this.reviewer = reviewer;
    }
}
