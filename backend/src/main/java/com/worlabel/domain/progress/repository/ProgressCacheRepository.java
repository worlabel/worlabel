package com.worlabel.domain.progress.repository;

import com.google.gson.Gson;
import com.worlabel.domain.report.entity.dto.ReportResponse;
import com.worlabel.global.cache.CacheKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

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
     * 현재 프로젝트 등록
     */
    public void registerTrainProject(final int projectId, final int modelId) {
        String key = CacheKey.trainProgressKey();
        redisTemplate.opsForHash().put(key, String.valueOf(projectId), String.valueOf(modelId));
    }

    /**
     * 현재 오토레이블링중인지 확인하는 메서드
     */
    public boolean trainProgressCheck(final int projectId) {
        String key = CacheKey.trainProgressKey();
        return redisTemplate.opsForHash().hasKey(key, String.valueOf(projectId));
    }

    public void removeTrainProgress(final int projectId) {
        String key = CacheKey.trainProgressKey();
        redisTemplate.opsForHash().delete(key, String.valueOf(projectId));
    }

    public int getProgressModelId(final int projectId) {
        String key = CacheKey.trainProgressKey();
        Object modelId = redisTemplate.opsForHash().get(key, String.valueOf(projectId));
        log.debug("projectId {} key {}", projectId, modelId);
        if (modelId == null) {
            return 0;
        }
        return Integer.parseInt((String) modelId);
    }

    /**
     * 현재 학습 진행 여부 확인 메서드 (단일 키 사용)
     */
    public boolean trainModelProgressCheck(final int projectId, final int modelId) {
        String key = CacheKey.trainKey(projectId, modelId);
        Long listSize = redisTemplate.opsForList().size(key);

        return listSize != null && listSize > 0;
    }

    /**
     * 진행 상황을 Redis에 추가 (리스트 형식 유지)
     */
    public void addProgressModel(final int projectId, final int modelId, final ReportResponse data) {
        String jsonData = gson.toJson(data);
        String key = CacheKey.trainKey(projectId, modelId);
        log.debug("key{} : data {}", key, jsonData);
        redisTemplate.opsForList().rightPush(key, jsonData);
    }

    public List<ReportResponse> getProgressModel(final int projectId, final int modelId) {
        // 저장된 진행 상황을 주어진 응답 형태로 변환하여 리턴
        String key = CacheKey.trainKey(projectId, modelId);
        List<String> progressList = redisTemplate.opsForList().range(key, 0, -1);

        return progressList.stream()
                .map(this::convert)
                .toList();
    }

    public void clearProgressModel(final int projectId, final int modelId) {
        String key = CacheKey.trainKey(projectId, modelId);
        redisTemplate.delete(key);
    }

    private ReportResponse convert(String data) {
        return gson.fromJson(data, ReportResponse.class);
    }


}
