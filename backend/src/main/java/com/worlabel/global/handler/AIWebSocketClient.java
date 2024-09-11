package com.worlabel.global.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class AIWebSocketClient extends TextWebSocketHandler {

    private WebSocketSession session;

    public  void connectToAIServer(){
        StandardWebSocketClient client = new StandardWebSocketClient();
        try{
            session = client.doHandshake()
        }
    }
}
