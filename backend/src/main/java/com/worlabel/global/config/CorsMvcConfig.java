package com.worlabel.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsMvcConfig implements WebMvcConfigurer {

    @Value("${frontend.url}")
    private String frontend;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .exposedHeaders("Set-Cookie")
                .allowedOrigins(frontend, "http://localhost:5173")  // application.yml에서 가져온 값 사용
                .allowCredentials(true);
    }
}
