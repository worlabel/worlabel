package com.worlabel.domain.auth.repository;

import com.worlabel.global.cache.CacheKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Slf4j
@Repository
@RequiredArgsConstructor
public class FcmCacheRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    public void save(int memberId, String token) {
        redisTemplate.opsForHash().put(CacheKey.fcmTokenKey(), String.valueOf(memberId), token);
    }

    public void delete(int memberId) {
        redisTemplate.opsForHash().delete(CacheKey.fcmTokenKey(), String.valueOf(memberId));
    }

    public String getToken(int memberId) {
        return (String) redisTemplate.opsForHash().get(CacheKey.fcmTokenKey(), String.valueOf(memberId));
    }
}
