package com.worlabel.domain.progress.repository;

import com.worlabel.global.cache.CacheKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Slf4j
@Repository
@RequiredArgsConstructor
public class ProgressCacheRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * 현재 오토레이블링중인지 확인하는 메서드
     */
    public boolean predictCheck(final int projectId) {
        String key = CacheKey.autoLabelingProgressKey();
        Boolean isProgress = redisTemplate.opsForSet().isMember(key, projectId);
        return Boolean.TRUE.equals(isProgress);
    }

    /**
     * 학습 진행 중 등록 메서드
     */
    public void registerPredictProgress(final int projectId) {
        String key = CacheKey.autoLabelingProgressKey();
        redisTemplate.opsForSet().add(key, projectId);
    }
}
