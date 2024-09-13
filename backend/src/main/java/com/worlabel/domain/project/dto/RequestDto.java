package com.worlabel.domain.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

public class RequestDto {

    @Data
    public class TrainDataInfo {
        private String imageUrl;
    }

    @Data
    public static class TrainRequest {
        @JsonProperty("project_id")
        private int projectId;

        @JsonProperty("data")
        private List<TrainDataInfo> data;
//        private int seed; // Optional
//        private float ratio; // Default = 0.8
//        private int epochs; // Default = 50
//        private float batch; // Default = -1

        // Getters and Setters
    }
}
