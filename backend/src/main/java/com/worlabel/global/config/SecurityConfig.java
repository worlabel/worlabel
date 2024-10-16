package com.worlabel.global.config;

import com.worlabel.domain.auth.handler.*;
import com.worlabel.domain.auth.service.CustomOAuth2UserService;
import com.worlabel.global.filter.JwtAuthenticationFilter;
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

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomAuthenticationDeniedHandler authenticationDeniedHandler;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Value("${frontend.url}")
    private String frontend;

    @Value("${ai.server}")
    private String aiServer;

    // AI 서버의 동적 경로 패턴을 미리 선언
    private final String[] aiServerPaths = {
            "/api/projects/*/reports/models/*" // 동적 경로 패턴
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // HTTP Basic 인증 방식 비활성화
        http.
                httpBasic((auth) -> auth.disable());

        // CSRF 비활성화
        http
                .csrf((auth) -> auth.disable());

        // Form 로그인 방식 비활성화
        http
                .formLogin((auth) -> auth.disable());

        // 세션 설정 비활성화
        http.sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // CORS 설정
        http
                .cors(configurer -> configurer.configurationSource(corsConfigurationSource()));

        http
                .exceptionHandling(configurer -> configurer
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(authenticationDeniedHandler)
                );

        // 경로별 인가 작업
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(aiServerPaths).permitAll()
                        .requestMatchers("/swagger", "/swagger-ui.html", "/swagger-ui/**", "/api-docs", "/api-docs/**", "/v3/api-docs/**", "/ws/**").permitAll()
                        .requestMatchers("/api/auth/reissue").permitAll()
                        .anyRequest().authenticated()
                );

        // OAuth2
        http
                .oauth2Login(oauth2 -> oauth2
                        .authorizationEndpoint(authorization -> authorization.baseUri("/api/login/oauth2/authorization"))
                        .redirectionEndpoint(redirection -> redirection.baseUri("/api/login/oauth2/code/*"))
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
                );

        // JWT 필터 추가
        http
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOrigins(List.of(frontend, aiServer, "http://localhost:5173", "http://localhost:8000"));  // 프론트엔드 URL 사용
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setMaxAge(3600L);

        configuration.addExposedHeader("Authorization");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}