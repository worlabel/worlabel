package com.worlabel.domain.report.controller;

import com.worlabel.domain.report.entity.dto.ReportResponse;
import com.worlabel.domain.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{project_id}/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/model/{model_id}")
    public List<ReportResponse> getReportsByModelId(@PathVariable("model_id") final Integer modelId, @PathVariable("project_id") final Integer projectId) {
        return reportService.getReportsByModelId(projectId,modelId);
    }
}