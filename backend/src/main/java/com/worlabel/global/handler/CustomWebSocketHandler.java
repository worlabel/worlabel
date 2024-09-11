package com.worlabel.global.handler;

import com.worlabel.global.service.RedisMessageSubscriber;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomWebSocketHandler extends TextWebSocketHandler {

    private final RedisTemplate<String , Object> redisTemplate;
//    private final RedisMessageSubscriber redisMessageSubscriber;

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) {
        log.debug("연결 성공 - afterConnectionEstablished");
//        redisMessageSubscriber.addSession(session);
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session,@NonNull CloseStatus status) {
        log.debug("연결 해제 - afterConnectionClosed");
//        redisMessageSubscriber.removeSession(session);
    }

    @Override
    protected void handleTextMessage(@NonNull WebSocketSession session, TextMessage message) {
        log.debug("메세지 받음 - handleTextMessage : {}",message.getPayload());
        // Redis 메시지 발행
        redisTemplate.convertAndSend("/ai/train", message.getPayload());
    }
}
