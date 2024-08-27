package com.worlabel.domain.auth.service;

import com.worlabel.domain.auth.attribute.OAuth2Attribute;
import com.worlabel.domain.auth.attribute.OAuth2AttributeFactory;
import com.worlabel.domain.auth.entity.ProviderType;
import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2UserAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * OAuth2 사용자 서비스 클래스
 * OAuth2 인증을 통해 사용자 정보를 로드하고 처리하는 역할
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest);
        log.debug("oAuth2User: {}", user.getAttributes());

        ProviderType provider = ProviderType.valueOf(userRequest.getClientRegistration().getRegistrationId().toUpperCase());
        OAuth2Attribute attribute = OAuth2AttributeFactory.parseAttribute(provider, user.getAttributes());
        log.debug("provider: {}, user: {}", provider, user);

        Member findMember = memberRepository.findByProviderMemberId(attribute.getId())
                .orElseGet(() -> {
                    Member member = Member.of(attribute.getId(), attribute.getEmail(), attribute.getName(), attribute.getProfileImage());
                    memberRepository.save(member);
                    return member;
                });

        return new DefaultOAuth2User(Collections.singleton(new OAuth2UserAuthority(user.getAttributes())),
                user.getAttributes(),
                "sub"
        );
    }
}
