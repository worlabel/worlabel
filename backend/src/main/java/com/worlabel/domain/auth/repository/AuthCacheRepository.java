package com.worlabel.domain.auth.repository;

import com.worlabel.global.cache.CacheKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Slf4j
@Repository
@RequiredArgsConstructor
public class AuthCacheRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    public void save(int memberId, String token, Long expiredTime) {
        redisTemplate.opsForValue().set(CacheKey.authenticationKey(memberId), String.valueOf(token), expiredTime, TimeUnit.MILLISECONDS);
    }

    public String find(int memberId) {
        return (String) redisTemplate.opsForValue().get(CacheKey.authenticationKey(memberId));
    }

    public void delete(int memberId){
        redisTemplate.delete(CacheKey.authenticationKey(memberId));
    }
}
