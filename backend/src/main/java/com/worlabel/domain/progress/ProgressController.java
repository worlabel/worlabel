package com.worlabel.domain.progress;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class ProgressController {

    @MessageMapping("/ai/train/progress")
    @SendTo("/topic/progress")
    public String handleTrainingProgress(String message) {
        // FastAPI에서 전송한 학습 진행 상황 메시지를 처리하고 클라이언트로 전달
        log.debug("Received message: {}", message);
        return message;
    }
}
