package com.worlabel.domain.auth.service;

import com.worlabel.domain.auth.entity.CustomOAuth2User;
import com.worlabel.domain.auth.entity.dto.JwtToken;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

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

    public JwtToken generateToken(int memberId){
        long now = System.currentTimeMillis();

        Date accessTokenExpire = new Date(now + tokenExpiration);
        Date refreshTokenExpire = new Date(now + refreshTokenExpiration);

        String accessToken = Jwts.builder()
                .claim("id",memberId)
                .claim("type","access")
                .expiration(accessTokenExpire)
                .signWith(secretKey)
                .compact();

        String refreshToken = Jwts.builder()
                .claim("id",memberId)
                .claim("type","refresh")
                .expiration(refreshTokenExpire)
                .signWith(secretKey)
                .compact();

        return new JwtToken(accessToken, refreshToken);
    }

    public JwtToken generateTokenByRefreshToken(String refreshToken) throws Exception{
        if(isTokenExpired(refreshToken) && isRefreshToken(refreshToken)){
            return generateToken(Integer.parseInt(refreshToken));
        }
        throw new Exception("유효하지 않은 토큰입니다.");
    }

    public int parseId(String token) throws Exception {
        return parseClaims(token).get("id", Integer.class);
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
            String tokenType = claims.get("type", String.class);
            return expectedType.equals(tokenType);
        } catch (Exception e) {
            return false;
        }
    }

    public long getRefreshTokenExpiration(){
        return refreshTokenExpiration;
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
