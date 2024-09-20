package com.worlabel.global.filter;

import com.worlabel.domain.auth.entity.dto.AuthMemberDto;
import com.worlabel.domain.auth.service.JwtTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    public final String AUTHORIZATION_HEADER = "Authorization";
    private final JwtTokenService jwtTokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.debug(request.getRequestURI());
        String token = resolveToken(request);

        try {
            if (StringUtils.hasText(token) && !jwtTokenService.isTokenExpired(token) && jwtTokenService.isAccessToken(token)) {
                String name = jwtTokenService.parseUsername(token);
                int id = jwtTokenService.parseId(token);
                List<SimpleGrantedAuthority> authorities = jwtTokenService.parseAuthorities(token);

                Authentication authToken = new UsernamePasswordAuthenticationToken(
                        AuthMemberDto.of(id,name,authorities.getFirst().toString()),
                        null,
                        authorities
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                throw new JwtException("유효한 JWT 토큰이 없습니다.");
            }
        } catch (Exception e) {
            request.setAttribute("error-message", e.getMessage());
        }
        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
