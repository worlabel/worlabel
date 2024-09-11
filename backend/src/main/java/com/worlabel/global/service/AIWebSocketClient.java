package com.worlabel.global.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.URI;

@Slf4j
@Component
@RequiredArgsConstructor
public class AIWebSocketClient {

    private WebSocketSession session;

    // WebSocket 연결 설정
    public void connect(String url) {
        try {
            StandardWebSocketClient client = new StandardWebSocketClient();
            WebSocketHttpHeaders headers = new WebSocketHttpHeaders();
            client.doHandshake(new WebSocketHandler(), headers, URI.create(url)).get();
            log.info("Connected to WebSocket at {}", url);
        } catch (Exception e) {
            log.error("Failed to connect to WebSocket: {}", e.getMessage());
        }
    }

    // WebSocket 메시지 전송
    public void sendMessage(String message) {
        try {
            if (session != null && session.isOpen()) {
                session.sendMessage(new TextMessage(message));
                log.info("Sent message: {}", message);
            } else {
                log.warn("WebSocket session is not open. Unable to send message.");
            }
        } catch (Exception e) {
            log.error("Failed to send message: {}", e.getMessage());
        }
    }


    // WebSocket 연결 종료
    public void close() {
        try {
            if (session != null && session.isOpen()) {
                session.close();
                log.info("WebSocket connection closed.");
            }
        } catch (Exception e) {
            log.error("Failed to close WebSocket session: {}", e.getMessage());
        }
    }

    // WebSocket 핸들러 정의
    private class WebSocketHandler extends TextWebSocketHandler {
        @Override
        public void afterConnectionEstablished(WebSocketSession session) throws Exception {
            AIWebSocketClient.this.session = session;
            log.info("WebSocket connection established.");
        }

        @Override
        protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
            log.info("Received message: {}", message.getPayload());
            // 여기서 메시지를 처리하는 로직을 추가할 수 있습니다.
        }
    }
}
