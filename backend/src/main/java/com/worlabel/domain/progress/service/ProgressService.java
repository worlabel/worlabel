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
            throw new CustomException(ErrorCode.AI_IN_PROGRESS);
        }
    }

    public void registerPredictProgress(final int projectId) {
        progressCacheRepository.registerPredictProgress(projectId);
    }

    public void removePredictProgress(final int projectId) {
        progressCacheRepository.removePredictProgress(projectId);
    }

    public void trainProgressCheck(final int projectId, final int modelId) {
        if (progressCacheRepository.trainProgressCheck(projectId, modelId)) {
            throw new CustomException(ErrorCode.AI_IN_PROGRESS);
        }
    }

    public void registerTrainProgress(final int projectId, final int modelId) {
        progressCacheRepository.registerTrainProgress(projectId, modelId);
    }

    public boolean isProgressTrain(final int projectId, final int modelId) {
        return progressCacheRepository.trainProgressCheck(projectId, modelId);
    }

    public void registerTrainProgress(final int projectId, final int modelId, final ReportResponse data) {
        progressCacheRepository.addProgressModel(projectId, modelId, data);
    }

    public void removeTrainProgress(final int projectId, final int modelId) {
        progressCacheRepository.removeTrainProgress(projectId, modelId);
    }

    public List<ReportResponse> getProgressResponse(final int projectId, final int modelId) {
        return progressCacheRepository.getProgressModel(projectId, modelId);
    }
}
