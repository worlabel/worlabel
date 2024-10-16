package com.worlabel.domain.progress.service;

import com.worlabel.domain.progress.repository.ProgressCacheRepository;
import com.worlabel.domain.report.entity.dto.ReportResponse;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressCacheRepository progressCacheRepository;

    public void predictProgressCheck(final int projectId) {
        if (progressCacheRepository.predictProgressCheck(projectId)) {
            throw new CustomException(ErrorCode.AI_IN_PROGRESS, "해당 프로젝트 오토레이블링 진행 중");
        }
    }
    public void registerPredictProgress(final int projectId) {
        progressCacheRepository.registerPredictProgress(projectId);
    }

    public void removePredictProgress(final int projectId) {
        progressCacheRepository.removePredictProgress(projectId);
    }

    public void registerTrainProcess(final int projectId, final int modelId) {
        progressCacheRepository.registerTrainProject(projectId, modelId);
    }

    public void removeTrainProgress(final int projectId){
        progressCacheRepository.removeTrainProgress(projectId);
    }

    public void trainProgressCheck(final int projectId) {
        if (progressCacheRepository.trainProgressCheck(projectId)) {
            throw new CustomException(ErrorCode.AI_IN_PROGRESS);
        }
    }

    public boolean isProgressTrain(final int projectId, final int modelId) {
        return progressCacheRepository.trainModelProgressCheck(projectId, modelId);
    }

    public void addProgressModel(final int projectId, final int modelId, final ReportResponse data) {
        progressCacheRepository.addProgressModel(projectId, modelId, data);
    }

    public int getProgressModelByProjectId(final int projectId) {
        return progressCacheRepository.getProgressModelId(projectId);
    }

    public List<ReportResponse> getProgressResponse(final int projectId, final int modelId) {
        return progressCacheRepository.getProgressModel(projectId, modelId);
    }

    public void clearProgress(final int projectId, final int modelId) {
        progressCacheRepository.clearProgressModel(projectId, modelId);
    }
}
