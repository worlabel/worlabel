package com.worlabel.global.filter;

import com.worlabel.domain.auth.entity.CustomOAuth2User;
import com.worlabel.domain.member.repository.MemberRepository;
import com.worlabel.global.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final MemberRepository memberRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = getToken(request);
        try {
            if (StringUtils.hasText(token) && !jwtUtil.isExpired(token)) {
                String username = jwtUtil.getUsername(token);
                memberRepository.findByEmail(username).ifPresent(member -> {
                    CustomOAuth2User customOAuth2User = new CustomOAuth2User(member);
                    Authentication authToken = new UsernamePasswordAuthenticationToken(customOAuth2User.getAuthMember(), null, customOAuth2User.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                });
            } else {
                throw new JwtException("유효한 JWT 토큰이 없습니다.");
            }
        } catch (Exception e) {
            log.debug("message: {}",e.getMessage());
            SecurityContextHolder.clearContext();
            request.setAttribute("error-message", e.getMessage());
        }
        filterChain.doFilter(request, response);
    }

    private static String getToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        return Arrays.stream(Optional.ofNullable(cookies).orElse(new Cookie[0]))
                .filter(cookie -> "Authorization".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
