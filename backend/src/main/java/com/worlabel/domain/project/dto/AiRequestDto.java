package com.worlabel.domain.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.worlabel.domain.image.entity.Image;
import lombok.*;

import java.util.List;

public class AiRequestDto {

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

    @Getter
    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    public static class AutoLabelingRequest {

        @JsonProperty("project_id")
        private Integer projectId;

        @JsonProperty("model_key")
        private String modelKey;

        @JsonProperty("image_list")
        private List<AutoLabelingImageRequest> imageList;

        @JsonProperty("conf_threshold")
        private Double confThreshold;

        @JsonProperty("iou_threshold")
        private Double iouThreshold;

        public static AutoLabelingRequest of(final Integer projectId, final List<AutoLabelingImageRequest> imageList) {
            return new AutoLabelingRequest(projectId, null, imageList, 0.25, 0.45);
        }
    }

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @Getter
    public static class AutoLabelingImageRequest {

        @JsonProperty("image_id")
        private Long imageId;

        @JsonProperty("image_url")
        private String imageUrl;

        public static AutoLabelingImageRequest of(Image image){
            return new AutoLabelingImageRequest(image.getId(), image.getImagePath());
        }
    }
}
