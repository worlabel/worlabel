package com.worlabel.domain.label.entity.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class AutoLabelingRequest {

    @JsonProperty("project_id")
    private Integer projectId;

    @JsonProperty("image_list")
    private List<ImageRequest> imageList;

    // private Double confThreshold
    // private Double iouThreshold;
    // List<?> classes

    public static AutoLabelingRequest of(final Integer projectId, final List<ImageRequest> imageList) {
        return new AutoLabelingRequest(projectId, imageList);
    }
}
