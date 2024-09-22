package com.worlabel.domain.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

public class RequestDto {

    @Data
    public static class TrainDataInfo {
        private String imagePath;
        private String dataPath;

        public TrainDataInfo(String imagePath, String dataPath) {
            this.imagePath = imagePath;
            this.dataPath = dataPath;
        }
    }

    @Data
    public static class TrainRequest {
        @JsonProperty("project_id")
        private int projectId;

        @JsonProperty("category_id")
        private List<Integer> categoryId;

        @JsonProperty("data")
        private List<TrainDataInfo> data;

        @JsonProperty("model_key")
        private String modelKey;
//        private int seed; // Optional
//        private float ratio; // Default = 0.8
//        private int epochs; // Default = 50
//        private float batch; // Default = -1

        // Getters and Setters
    }
}
