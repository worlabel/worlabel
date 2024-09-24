package com.worlabel.global.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FcmService {

    private final FirebaseMessaging firebaseMessaging;

    private void sendNotification(String targetToken, String title, String body){
        Message message = Message.builder()
                .setToken(targetToken)
                .putData("title",title)
                .putData("body",body)
                .build();
        try {
            log.debug("FCM 알림 전송 {}", message);
            firebaseMessaging.sendAsync(message);
        } catch (Exception e) {
            log.error("FCM 전송 오류 ", e);
        }
    }
}
