package com.worlabel.domain.report.service;

import com.worlabel.domain.progress.service.ProgressService;
import com.worlabel.domain.report.entity.Report;
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
        // 진행중이면 진행중에서 받아오기
        return getDummyList();
//        if(progressService.isProgressTrain(projectId)){
//            return progressService.getProgressResponse(modelId);
//        }
//        // 작업 완료시에는 RDB
//        else{
//            List<Report> reports = reportRepository.findByAiModelId(modelId);
//            return reports.stream()
//                    .map(ReportResponse::from)
//                    .toList();
//        }
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

}