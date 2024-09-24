package com.worlabel.domain.report.service;

import com.worlabel.domain.report.entity.Report;
import com.worlabel.domain.report.entity.dto.ReportResponse;
import com.worlabel.domain.report.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    public List<ReportResponse> getReportsByModelId(final Integer modelId) {
        List<Report> reports = reportRepository.findByAiModelId(modelId);
        return reports.stream()
                .map(ReportResponse::from)
                .toList();
    }
}