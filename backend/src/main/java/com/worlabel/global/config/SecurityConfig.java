package com.worlabel.global.config;

import lombok.Builder;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // HTTP 요청에 대한 인증 및 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 경로는 모든 사용자가 접근 할 수 있도록 허용
                        .requestMatchers("/**","/favicon.ico").permitAll()
                        // 그 외의 모든 요청은 인증해야함
                        .anyRequest().authenticated()
                )
                // OAuth2 로그인 설정
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo ->
                                // 사용자 정보를 처리하는 서비스로 DefaultOAuth2UserService
                                userInfo.userService(new DefaultOAuth2UserService()))
                )
                // CSRF 보호 설정
                .csrf(csrf -> csrf // CSRF 보호 활성화 및 커스터마이징
                        // CSRF토큰을 쿠키에 저장하도록 설정, HTTP-only 속성을 비활성화하여 자바스크립트에서 접근 가능하게 함
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                );
        // 설정을 바탕으로 SecurityFilterChain 빌드
        return http.build();
    }
}
