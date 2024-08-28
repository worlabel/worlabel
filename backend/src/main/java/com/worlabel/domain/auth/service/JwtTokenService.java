package com.worlabel.domain.auth.service;

import com.worlabel.domain.auth.entity.CustomOAuth2User;
import com.worlabel.domain.auth.entity.dto.JwtToken;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
public class JwtTokenService {

    private final SecretKey secretKey;
    private final Long tokenExpiration;
    private final Long refreshTokenExpiration;

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

    public JwtToken generateTokenByRefreshToken(String refreshToken) throws Exception{
        if (!isTokenExpired(refreshToken) && isRefreshToken(refreshToken)) {
            Claims claims = parseClaims(refreshToken);
            String username = claims.getSubject();
            int memberId = claims.get("id", Integer.class);
            List<String> authorities = parseAuthorities(refreshToken).stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
            return generateToken(username, memberId, authorities);
        }
        throw new Exception("유효하지 않은 토큰입니다.");
    }

    private JwtToken generateToken(String username, int memberId, List<String> authorities){
        long now = System.currentTimeMillis();

        Date accessTokenExpire = new Date(now + tokenExpiration);
        Date refreshTokenExpire = new Date(now + refreshTokenExpiration);

        String accessToken = Jwts.builder()
                .subject(username)
                .claim("type", "access")
                .claim("id", memberId)
                .claim("authorities", authorities)  // 권한 정보 추가
                .expiration(accessTokenExpire)
                .signWith(secretKey)
                .compact();

        String refreshToken = Jwts.builder()
                .subject(username)
                .claim("type","refresh")
                .claim("authorities", memberId)
                .claim("authorities", authorities)  // 권한 정보 추가
                .expiration(refreshTokenExpire)
                .signWith(secretKey)
                .compact();

        log.debug("액세스 발급: {}",accessToken);
        return new JwtToken(accessToken, refreshToken);
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
    public boolean isTokenExpired(String token){
        try{
            Claims claims = parseClaims(token);
            return claims.getExpiration().before(new Date());
        }catch (ExpiredJwtException e) {
            return true; // 만료된 토큰
        } catch (Exception e) {
            return false; // 다른 오류일 경우
        }
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
            log.debug("claims : {}",claims);
            String tokenType = claims.get("type", String.class);
            return expectedType.equals(tokenType);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private Claims parseClaims(String token) throws Exception {
        String message;
        try{
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        }catch (ExpiredJwtException e){
            message = "유효기간이 만료된 토큰입니다.";
        }catch (MalformedJwtException e){
            message = "잘못된 형식의 토큰입니다.";
        }catch (IllegalArgumentException e) {
            message = "잘못된 인자입니다.";
        }catch (Exception e){
            message = "토큰 파싱 중 에러가 발생했습니다.";
        }
        throw new Exception(message);
    }
}
