package com.worlabel.global.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketMessageSubscriber {
    
    public void onMessage(String message) {
        // Redis 메세지를 수신하여 WebSocket 클라이언트에 전달 하기
        log.debug("수신 - {} 이곳에서 클라이언트에게 전달",message);
    }
}
