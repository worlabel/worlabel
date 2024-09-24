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
    public boolean predictProgressCheck(final int projectId) {
        Boolean isProgress = redisTemplate.opsForSet().isMember(CacheKey.autoLabelingProgressKey(), projectId);
        return Boolean.TRUE.equals(isProgress);
    }

    /**
     * 오토레이블링 진행 중 등록 메서드
     */
    public void registerPredictProgress(final int projectId) {
        redisTemplate.opsForSet().add(CacheKey.autoLabelingProgressKey(), projectId);
    }

    /**
     * 오토레이블링 진행 제거 메서드
     */
    public void removePredictProgress(final int projectId) {
        redisTemplate.opsForSet().remove(CacheKey.autoLabelingProgressKey(), projectId);
    }

    /**
     * 학습 진행 확인 메서드
     */
    public boolean trainProgressCheck(final int projectId) {
        Boolean isProgress = redisTemplate.opsForSet().isMember(CacheKey.trainProgressKey(), projectId);
        return Boolean.TRUE.equals(isProgress);
    }

    /**
     * 학습 진행 등록 메서드
     */
    public void registerTrainProgress(final int projectId) {
        redisTemplate.opsForSet().add(CacheKey.trainProgressKey(), projectId);
    }

    /**
     * 학습 진행 제거 메서드
     */
    public void removeTrainProgress(final int projectId) {
        redisTemplate.opsForSet().remove(CacheKey.trainProgressKey(), projectId);
    }
}
