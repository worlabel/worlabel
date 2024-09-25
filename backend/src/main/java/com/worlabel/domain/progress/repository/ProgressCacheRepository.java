package com.worlabel.domain.progress.repository;

import com.google.gson.Gson;
import com.worlabel.domain.report.entity.dto.ReportResponse;
import com.worlabel.global.cache.CacheKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Repository
@RequiredArgsConstructor
public class ProgressCacheRepository {

    private final RedisTemplate<String, String> redisTemplate;
    private final Gson gson;

    /**
     * 현재 오토레이블링중인지 확인하는 메서드
     */
    public boolean predictProgressCheck(final int projectId) {
        Boolean isProgress = redisTemplate.opsForSet().isMember(CacheKey.autoLabelingProgressKey(), String.valueOf(projectId));
        return Boolean.TRUE.equals(isProgress);
    }

    /**
     * 오토레이블링 진행 중 등록 메서드
     */
    public void registerPredictProgress(final int projectId) {
        redisTemplate.opsForSet().add(CacheKey.autoLabelingProgressKey(), String.valueOf(projectId));
    }

    /**
     * 오토레이블링 진행 제거 메서드
     */
    public void removePredictProgress(final int projectId) {
        redisTemplate.opsForSet().remove(CacheKey.autoLabelingProgressKey(), String.valueOf(projectId));
    }

    /**
     * 학습 진행 확인 메서드
     */
    public boolean trainProgressCheck(final int projectId) {
        Boolean isProgress = redisTemplate.opsForSet().isMember(CacheKey.trainProgressKey(), String.valueOf(projectId));
        return Boolean.TRUE.equals(isProgress);
    }

    /**
     * 학습 진행 등록 메서드
     */
    public void registerTrainProgress(final int projectId) {
        redisTemplate.opsForSet().add(CacheKey.trainProgressKey(), String.valueOf(projectId));
    }

    /**
     * 학습 진행 제거 메서드
     */
    public void removeTrainProgress(final int projectId) {
        redisTemplate.opsForSet().remove(CacheKey.trainProgressKey(), String.valueOf(projectId));
    }

    /**
     * 진행 상황을 Redis에 추가
     */
    public void addProgressModel(final int modelId,final String data){
        ReportResponse reportResponse = convert(data);
        redisTemplate.opsForList().rightPush(CacheKey.progressStatusKey(modelId), gson.toJson(reportResponse));
    }

    public List<ReportResponse> getProgressModel(final int modelId) {
        // 저장된 걸 주어진 응답에 맞추어 리턴
        String key = CacheKey.progressStatusKey(modelId);
        List<String> progressList = redisTemplate.opsForList().range(key, 0, -1);

        return progressList.stream()
                .map(this::convert)
                .toList();
    }

    public void clearProgressModel(final int modelId) {
        redisTemplate.delete(CacheKey.progressStatusKey(modelId));
    }

    private ReportResponse convert(String data){
        return gson.fromJson(data, ReportResponse.class);
    }
}
