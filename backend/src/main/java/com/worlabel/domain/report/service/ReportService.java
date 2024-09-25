package com.worlabel.domain.report.service;

import com.worlabel.domain.model.entity.AiModel;
import com.worlabel.domain.progress.repository.ProgressCacheRepository;
import com.worlabel.domain.progress.service.ProgressService;
import com.worlabel.domain.project.repository.ProjectRepository;
import com.worlabel.domain.report.entity.Report;
import com.worlabel.domain.report.entity.dto.ReportRequest;
import com.worlabel.domain.report.entity.dto.ReportResponse;
import com.worlabel.domain.report.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final ProgressService progressService;

    public List<ReportResponse> getReportsByModelId(final Integer projectId, final Integer modelId) {
        return reportRepository.findByAiModelId(modelId).stream()
                .map(ReportResponse::from)
                .toList();
    }

    private List<ReportResponse> getDummyList() {
        List<ReportResponse> dummyList = new ArrayList<>();

        // 더미 데이터 15개 생성
        for (int i = 1; i <= 15; i++) {
            ReportResponse dummy = new ReportResponse(
                    i,                 // modelId
                    100,               // totalEpochs
                    i,                 // epoch
                    Math.random(),     // boxLoss
                    Math.random(),     // clsLoss
                    Math.random(),     // dflLoss
                    Math.random(),     // fitness
                    Math.random() * 10,// epochTime
                    Math.random() * 100 // leftSecond
            );
            dummyList.add(dummy);
        }

        return dummyList;
    }

    public void addReportByModelId(final Integer projectId, final Integer modelId, final ReportRequest reportRequest) {
        ReportResponse reportResponse = ReportResponse.of(reportRequest, modelId);

        if (progressService.isProgressTrain(projectId, modelId)) { // 이미 존재하면 뒤에 추가
            progressService.registerTrainProgress(projectId, modelId, reportResponse);
        } else {  // 새로추가
            progressService.registerTrainProgress(projectId, modelId, reportResponse);
        }
    }

    public List<ReportResponse> getReportsProgressByModelId(final Integer projectId, final Integer modelId) {
        if (progressService.isProgressTrain(projectId, modelId)) {
            return progressService.getProgressResponse(projectId, modelId);
        }

        return List.of();
    }

    public void changeReport(Integer projectId, Integer modelId, AiModel newModel) {
        List<ReportResponse> progressResponse = progressService.getProgressResponse(projectId, modelId);

        List<Report> reports = new ArrayList<>();
        for (ReportResponse reportResponse : progressResponse) {
            Report report = Report.of(newModel,
                    reportResponse.getEpoch(),
                    reportResponse.getTotalEpochs(),
                    reportResponse.getBoxLoss(),
                    reportResponse.getClsLoss(),
                    reportResponse.getDflLoss(),
                    reportResponse.getFitness(),
                    reportResponse.getEpochTime(),
                    reportResponse.getLeftSecond());

            reports.add(report);
        }
        reportRepository.saveAll(reports);
        progressService.removeTrainProgress(projectId, modelId);
    }
}