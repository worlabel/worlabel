package com.worlabel.domain.report.repository;

import com.worlabel.domain.report.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Integer> {

    @Query("SELECT r FROM Report r " +
            "WHERE r.aiModel.id =:modelId ")
    List<Report> findByAiModelId(@Param("modelId") Integer modelId);
}
