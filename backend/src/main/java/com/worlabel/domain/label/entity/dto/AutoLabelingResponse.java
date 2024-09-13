package com.worlabel.domain.label.entity.dto;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class AutoLabelingResponse {

    private Long imageId;
    private String imageUrl;
    private String data; // JSON 형식의 데이터를 그대로 저장

    public static AutoLabelingResponse of(Long imageId, String title, String data) {
        return new AutoLabelingResponse(imageId, title, data);
    }
}