package com.worlabel.domain.progress;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.worlabel.domain.label.entity.dto.AutoLabelingResponse;
import com.worlabel.domain.label.service.LabelService;
import com.worlabel.global.service.S3UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ProgressController {

    private final LabelService labelService;
    private final S3UploadService s3UploadService;
    private final Gson gson;

    @MessageMapping("/ai/train/progress")
    @SendTo("/topic/progress")
    public String handleTrainingProgress(String message) {
        // FastAPI에서 전송한 학습 진행 상황 메시지를 처리하고 클라이언트로 전달
        log.debug("Received message: {}", message);
        return message;
    }

    @MessageMapping("/ai/predict/progress")
    @SendTo("/topic/progress")
    public String handlePredictProgress(String message) {
        JsonObject jsonObject = gson.fromJson(message, JsonObject.class);

        int progress = jsonObject.get("progress").getAsInt();
        AutoLabelingResponse autoLabelingResponse = labelService.parseAutoLabelingResponse(jsonObject.getAsJsonObject("result"));
        labelService.saveAutoLabel(autoLabelingResponse);
        log.debug("오토 레이블링 진행률 : {}%",progress);
        return String.valueOf(progress);
    }
}
