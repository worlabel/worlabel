package com.worlabel.domain.progress;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ProgressController {

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

        // TODO: 웹 소켓 연결 후 해당 위치에서 다시 처리
        int progress = jsonObject.get("progress").getAsInt();
        log.debug("오토 레이블링 진행률 : {}%",progress);
        return String.valueOf(progress);
    }
}
