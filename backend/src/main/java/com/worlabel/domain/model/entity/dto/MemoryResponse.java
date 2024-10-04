package com.worlabel.domain.model.entity.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@ToString
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class MemoryResponse {

    @JsonProperty("current_device")
    @Schema(description = "사용중인 디바이스 ID", example = "1")
    private int deviceId;

    @Schema(description = "전체 GPU 메모리(GB)", example = "1")
    private double total;

    @Schema(description = "현재 사용중인 GPU 메모리(GB)", example = "1")
    private double allocated;

    @Schema(description = "예약된 GPU 메모리(GB)", example = "1")
    private double reserved;
    
    @Schema(description = "사용 가능한 GPU 메모리(GB)", example = "1")
    private double free;
}