package com.worlabel.domain.label.entity.dto;

import lombok.Data;

@Data
public class AutoLabelingResponse {
    private String image_id;
    private String title;
    private String data; // JSON 형식의 데이터를 그대로 저장
}