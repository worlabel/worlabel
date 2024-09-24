package com.worlabel.domain.report.repository;

import com.worlabel.domain.report.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Integer> {

    List<Report> findByAiModelId(Integer modelId);
}
