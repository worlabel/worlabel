package com.worlabel.domain.member.entity;

import com.worlabel.domain.auth.attribute.OAuth2Attribute;
import com.worlabel.domain.auth.entity.ProviderType;
import com.worlabel.domain.comment.entity.Comment;
import com.worlabel.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name = "member")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseEntity {

    /**
     * 사용자 PK
     */
    @Id
    @Column(name = "member_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 제공받은 사용자 ID
     */
    @Column(name = "provider_member_id", nullable = false, length = 255)
    private String providerMemberId;

    /**
     * oAuth 제공자 타입
     */
    @Column(name = "provider", nullable = false)
    @Enumerated(EnumType.STRING)
    private ProviderType provider = ProviderType.GOOGLE;

    /**
     * 사용자 이메일
     */
    @Column(name = "email",nullable = false, length = 40)
    private String email;

    /**
     * 사용자 닉네임
     */
    @Column(name = "nickname",nullable = false, length = 20)
    private String nickname;

    /**
     * 사용자 역할
     */
    @Column(name = "user_role", nullable = false)
    @Enumerated(EnumType.STRING)
    private RoleType role = RoleType.USER;

    /**
     * 프로필 이미지
     */
    @Column(name = "profile_image", nullable = false)
    private String profileImage;

    /**
     * 작성한 코멘트
     */
    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY,cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> commentList = new ArrayList<>();
    
    public static Member create(OAuth2Attribute attribute, ProviderType provider) {
        Member member = new Member();
        member.providerMemberId = attribute.getId();
        member.email = attribute.getEmail();
        member.nickname = attribute.getName();
        member.profileImage = attribute.getProfileImage();
        member.provider = provider;
        return member;
    }
}
