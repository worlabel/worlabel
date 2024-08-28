package com.worlabel.global.filter;

import com.worlabel.domain.auth.entity.CustomOAuth2Member;
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
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final MemberRepository memberRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Cookie[] cookies = request.getCookies();
        String token = Arrays.stream(Optional.ofNullable(cookies).orElse(new Cookie[0]))
                .filter(cookie -> "Authorization".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);

        if(token == null || jwtUtil.isExpired(token)){
            log.debug("토큰 X");
            filterChain.doFilter(request, response);
            return;
        }

        String username = jwtUtil.getUsername(token);
        memberRepository.findByEmail(username).ifPresent(member -> {
            CustomOAuth2Member customOAuth2Member = new CustomOAuth2Member(member);
            Authentication authToken = new UsernamePasswordAuthenticationToken(customOAuth2Member.getAuthMemberDto(), null, customOAuth2Member.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authToken);
        });

        filterChain.doFilter(request, response);
    }
}
