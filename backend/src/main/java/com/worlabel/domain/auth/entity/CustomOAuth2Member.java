package com.worlabel.domain.auth.entity;

import com.worlabel.domain.auth.dto.AuthMemberDto;
import com.worlabel.domain.member.entity.Member;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public class CustomOAuth2Member implements OAuth2User {

    @Getter
    private final AuthMemberDto authMemberDto;

    public CustomOAuth2Member(Member member) {
        authMemberDto = AuthMemberDto.of(member);
    }

    @Override
    public Map<String, Object> getAttributes() {
        // OAuth2 제공자로부터 받은 사용자 속성 데이터를 반환합니다.
        return Map.of(
                "id", authMemberDto.getId(),
                "email", authMemberDto.getEmail(),
                "role", authMemberDto.getRole()
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 사용자의 역할(RoleType)을 권한으로 변환하여 반환합니다.
        return List.of(new SimpleGrantedAuthority(authMemberDto.getRole()));
    }

    @Override
    public String getName() {
        // 사용자의 고유 식별자를 반환합니다. 여기서는 이메일을 사용합니다.
        return authMemberDto.getEmail();
    }
}
