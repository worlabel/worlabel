package com.worlabel.domain.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.SerializedName;
import com.worlabel.domain.image.entity.Image;
import com.worlabel.domain.model.entity.dto.ModelTrainRequest;
import com.worlabel.domain.result.entity.Optimizer;
import lombok.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AiDto {

    @Getter
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static class TrainDataInfo {

        @JsonProperty("image_url")
        private String imagePath;

        @JsonProperty("data_url")
        private String dataPath;

        public static TrainDataInfo of(Image image) {
            return new TrainDataInfo(image.getImagePath(), image.getDataPath());
        }
    }

    @Getter
    @ToString
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static class TrainRequest {

        @JsonProperty("project_id")
        private int projectId;

        @JsonProperty("model_key")
        private String modelKey;

        @JsonProperty("model_id")
        private Integer modelId;

        @JsonProperty("label_map")
        private Map<Integer, Integer> labelMap;

        @JsonProperty("data")
        private List<TrainDataInfo> data;

        private double ratio; // Default = 0.8

        private int epochs; // Default = 50

        private double batch; // Default = -1

        private double lr0;

        private double lrf;

        private Optimizer optimizer;

        public static TrainRequest of(final Integer projectId, final Integer modelId, final String modelKey, final Map<Integer, Integer> labelMap, final List<TrainDataInfo> data, final ModelTrainRequest trainRequest) {
            TrainRequest request = new TrainRequest();
            request.projectId = projectId;
            request.modelId = modelId;
            request.modelKey = modelKey;
            request.labelMap = labelMap;
            request.data = data;
            request.ratio = request.getRatio();
            request.epochs = trainRequest.getEpochs();
            request.batch = trainRequest.getBatch();
            request.lr0 = trainRequest.getLr0();
            request.lrf = trainRequest.getLrf();
            request.optimizer = trainRequest.getOptimizer();

            return request;
        }
    }

    @Getter
    @ToString
    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    public static class AutoLabelingRequest {

        @JsonProperty("project_id")
        private Integer projectId;

        @JsonProperty("model_key")
        private String modelKey;

        @JsonProperty("label_map")
        private HashMap<Integer, Integer> labelMap;

        @JsonProperty("image_list")
        private List<AutoLabelingImageRequest> imageList;

        @JsonProperty("conf_threshold")
        private Double confThreshold;

        @JsonProperty("iou_threshold")
        private Double iouThreshold;

        public static AutoLabelingRequest of(final Integer projectId, final String modelKey, final HashMap<Integer, Integer> labelMap, final List<AutoLabelingImageRequest> imageList) {
            return new AutoLabelingRequest(projectId, modelKey, labelMap, imageList, 0.25, 0.45);
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

        public static AutoLabelingImageRequest of(Image image) {
            return new AutoLabelingImageRequest(image.getId(), image.getImagePath());
        }
    }

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @Getter
    @ToString
    public static class AutoLabelingResult {

        @SerializedName("image_id")
        private Long imageId;

        @SerializedName("data")
        private String data;
    }
}
