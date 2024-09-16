package com.worlabel.domain.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class AutoLabelingRequest {

    @JsonProperty("project_id")
    private Integer projectId;

    @JsonProperty("image_list")
    private List<AutoLabelingImageRequest> imageList;

    // private Double confThreshold
    // private Double iouThreshold;
    // List<?> classes

    public static AutoLabelingRequest of(final Integer projectId, final List<AutoLabelingImageRequest> imageList) {
        return new AutoLabelingRequest(projectId, imageList);
    }
}
