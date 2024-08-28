package com.worlabel.domain.auth.entity;

import com.worlabel.domain.auth.entity.dto.AuthMemberDto;
import com.worlabel.domain.member.entity.Member;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User {

    @Getter
    private transient final AuthMemberDto authMember;

    public CustomOAuth2User(Member member) {
        authMember = AuthMemberDto.of(member);
    }

    @Override
    public Map<String, Object> getAttributes() {
        // OAuth2 제공자로부터 받은 사용자 속성 데이터를 반환합니다.
        return Map.of(
                "id", authMember.getId(),
                "email", authMember.getEmail(),
                "role", authMember.getRole()
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 사용자의 역할(RoleType)을 권한으로 변환하여 반환합니다.
        return List.of(new SimpleGrantedAuthority(authMember.getRole()));
    }

    @Override
    public String getName() {
        // 사용자의 고유 식별자를 반환합니다. 여기서는 이메일을 사용합니다.
        return authMember.getEmail();
    }

    public int getId(){
        return authMember.getId();
    }
}
