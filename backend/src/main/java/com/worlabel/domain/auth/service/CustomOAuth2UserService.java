package com.worlabel.domain.auth.service;

import com.worlabel.domain.auth.attribute.OAuth2Attribute;
import com.worlabel.domain.auth.attribute.OAuth2AttributeFactory;
import com.worlabel.domain.auth.entity.CustomOAuth2User;
import com.worlabel.domain.auth.entity.ProviderType;
import com.worlabel.domain.member.entity.Member;
import com.worlabel.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        // OAuth2 인증을 통해 사용자 정보를 가져온다.
        OAuth2User user = super.loadUser(userRequest);

        // OAuth2 제공자 정보 가져오기
        ProviderType provider = ProviderType.valueOf(userRequest.getClientRegistration().getRegistrationId().toUpperCase());

        // Provider 사용자 속성 파싱
        OAuth2Attribute attribute = OAuth2AttributeFactory.parseAttribute(provider, user.getAttributes());
        log.debug("OAuth2 -> provider: {}, user: {}", provider, user);

        // 이메일 기반으로 기존 사용자를 찾는다.
        Member findMember = memberRepository.findByEmail(attribute.getEmail())
                .orElseGet(() -> createMember(attribute, provider));
        log.debug("Loaded member : {}", findMember);

        return new CustomOAuth2User(findMember);
    }

    @Transactional
    protected Member createMember(OAuth2Attribute attribute, ProviderType provider) {
        Member newMember = Member.create(attribute, provider);
        memberRepository.save(newMember);
        return newMember;
    }
}
