package com.worlabel.domain.comment.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.worlabel.domain.member.entity.Member;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name= "comment")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment extends BaseEntity {

    /**
     * 코멘트 PK
     */
    @Id
    @Column(name = "comment_id",nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 코멘트 내용
     */
    @Column(name = "content",nullable = false)
    private String content;

    /**
     * 코멘트 위치(x)
     */
    @Column(name = "positionX",nullable = true)
    private double positionX;

    /**
     * 코멘트 위치(y)
     */
    @Column(name = "positionY",nullable = true)
    private double positionY;

    /**
     * 속한 사용자
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id",nullable = false)
    @JsonIgnore
    private Member member;
}
