package com.worlabel.domain.auth.service;

import com.worlabel.domain.auth.entity.CustomOAuth2User;
import com.worlabel.domain.auth.entity.dto.JwtToken;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
public class JwtTokenService {

    private final SecretKey secretKey;
    private final Long tokenExpiration;
    private final Long refreshTokenExpiration;
    private Key key ;

    public JwtTokenService(
            @Value("${spring.jwt.secret}") String key,
            @Value("${auth.tokenExpiry}") long tokenExpiry,
            @Value("${auth.refreshTokenExpiry}") long refreshExpiry
    ) {
        secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
        tokenExpiration = tokenExpiry;
        refreshTokenExpiration = refreshExpiry;
    }

    public JwtToken generateTokenByOAuth2User(CustomOAuth2User user) {
        List<String> authorities = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        return generateToken(user.getName(), user.getId(), authorities);
    }

    public JwtToken generateTokenByRefreshToken(String refreshToken) throws Exception {
        log.debug("생성");

        if (isTokenExpired(refreshToken)) {
            throw new CustomException(ErrorCode.REFRESH_TOKEN_EXPIRED);
        }

        if (!isRefreshToken(refreshToken)) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        log.debug("유효성 통과");

        Claims claims = parseClaims(refreshToken);
        String username = claims.getSubject();
        int memberId = claims.get("id", Integer.class);
        List<String> authorities = parseAuthorities(refreshToken).stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        return generateToken(username, memberId, authorities);
    }

    private JwtToken generateToken(String username, int memberId, List<String> authorities) {
        long now = System.currentTimeMillis();

        Date accessTokenExpire = new Date(now + tokenExpiration);
        Date refreshTokenExpire = new Date(now + refreshTokenExpiration);

        log.debug("액세스 만료 시간 : {}", accessTokenExpire.getTime());
        log.debug("리프레시 만료 시간 : {}", refreshTokenExpire.getTime());

        String accessToken = Jwts.builder()
                .subject(username)
                .claim("type", "access")
                .claim("id", memberId)
                .claim("authorities", authorities)  // 권한 정보 추가
                .issuedAt(new Date(now))
                .expiration(accessTokenExpire)
                .claim("jti", UUID.randomUUID().toString())
                .signWith(secretKey)
                .compact();

        String refreshToken = Jwts.builder()
                .subject(username)
                .claim("type", "refresh")
                .claim("id", memberId)
                .claim("authorities", authorities)  // 권한 정보 추가
                .issuedAt(new Date(now))
                .expiration(refreshTokenExpire)
                .claim("jti", UUID.randomUUID().toString())
                .signWith(secretKey)
                .compact();

        return JwtToken.of(accessToken, refreshToken);
    }

    public String parseUsername(String token) throws Exception {
        return parseClaims(token).getSubject();
    }

    public int parseId(String token) throws Exception {
        return parseClaims(token).get("id", Integer.class);
    }

    public List<SimpleGrantedAuthority> parseAuthorities(String token) throws Exception {
        Claims claims = parseClaims(token);
        List<String> authorities = claims.get("authorities", List.class); // JWT에서 권한 정보 추출
        return authorities.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }

    // 토큰 만료 여부 확인
    public boolean isTokenExpired(String token) throws Exception {
        return parseClaims(token) == null;
    }

    public boolean isRefreshToken(String token) {
        return isTokenType(token, "refresh");
    }

    public boolean isAccessToken(String token) {
        return isTokenType(token, "access");
    }

    private boolean isTokenType(String token, String expectedType) {
        try {
            Claims claims = parseClaims(token);
            log.debug("claims : {}", claims);
            String tokenType = claims.get("type", String.class);
            return expectedType.equals(tokenType);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private Claims parseClaims(String token) throws Exception {
        String message;
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            message = "유효기간이 만료된 토큰입니다.";
        } catch (MalformedJwtException | SignatureException e) {
            message = "잘못된 형식의 토큰입니다.";
        } catch (IllegalArgumentException e) {
            message = "잘못된 인자입니다.";
        } catch (Exception e) {
            e.printStackTrace();
            message = "토큰 파싱 중 에러가 발생했습니다.";
        }
        throw new Exception(message);
    }
}
