package com.worlabel.global.config;

import com.worlabel.domain.auth.service.CustomOAuth2UserService;
import com.worlabel.global.filter.JwtAuthenticationFilter;
import com.worlabel.domain.auth.handler.CustomAuthenticationDeniedHandler;
import com.worlabel.domain.auth.handler.CustomAuthenticationEntryPoint;
import com.worlabel.domain.auth.handler.OAuth2SuccessHandler;
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
                                .requestMatchers("/swagger", "/swagger-ui.html", "/swagger-ui/**", "/api-docs", "/api-docs/**", "/v3/api-docs/**", "/ws/**").permitAll()
                                .requestMatchers("/api/auth/reissue").permitAll()
                                .anyRequest().authenticated()
//                        .anyRequest().permitAll()
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
        configuration.setAllowedOrigins(List.of(frontend, "http://localhost:5173"));  // 프론트엔드 URL 사용
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setMaxAge(3600L);

        configuration.addExposedHeader("Authorization");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

/*
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5czAxMDcxODUxNjUxQGdtYWlsLmNvbSIsInR5cGUiOiJhY2Nlc3MiLCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiVVNFUiJ9XSwiZXhwIjoxNzI0ODU1NzQ2fQ.tIo9e40nY1KjhBwYcw0BG18Q9qeTYAoXefezYM9YQiY

 */