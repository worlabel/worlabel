package com.worlabel.global.config;

import com.worlabel.domain.auth.service.CustomOAuth2MemberService;
import com.worlabel.domain.member.repository.MemberRepository;
import com.worlabel.global.filter.JWTFilter;
import com.worlabel.global.handler.OAuth2SuccessHandler;
import com.worlabel.global.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Collections;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2MemberService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final JWTUtil jwtUtil;

    @Value("${frontend.url}")
    private String frontend;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, MemberRepository memberRepository) throws Exception {

        // CSRF 비활성화
        http
                .csrf((auth) -> auth.disable());

        // Form 로그인 방식 Disable
        http
                .formLogin((auth) -> auth.disable());

        // HTTP Basic 인증 방식 disable
        http.
                httpBasic((auth) -> auth.disable());

        // OAuth2
        http
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(authorizationEndpoint ->
                                authorizationEndpoint.baseUri("/api/oauth2/authorization"))
                        .redirectionEndpoint(redirectionEndpoint ->
                                redirectionEndpoint.baseUri("/api/login/oauth2/code/*"))
                        .userInfoEndpoint(userInfoEndpointConfig ->
                                userInfoEndpointConfig.userService(customOAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
                );


        // 경로별 인가 작업
        http
                .authorizeHttpRequests((auth)->auth
                        .requestMatchers("/favicon.ico").permitAll()  // Allow access to favicon.ico
                        .requestMatchers("/").permitAll()
                        .anyRequest().authenticated());

        // 세션 설정: STATELESS
        http.sessionManagement((session)->session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // JWT 필터 추가
        http
                .addFilterAfter(new JWTFilter(jwtUtil, memberRepository), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Collections.singletonList(frontend));  // 프론트엔드 URL 사용
        configuration.setAllowedMethods(Collections.singletonList("*"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setMaxAge(3600L);

        configuration.addExposedHeader("Authorization");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


}
