package com.worlabel.global.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.worlabel.domain.alarm.entity.Alarm;
import com.worlabel.domain.alarm.entity.Alarm.AlarmType;
import com.worlabel.domain.alarm.service.AlarmService;
import com.worlabel.domain.auth.repository.FcmCacheRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class FcmService {

    private final FirebaseMessaging firebaseMessaging;
    private final FcmCacheRepository fcmCacheRepository;

    public void testSend(String targetToken){
        sendNotification(targetToken,  "testBody");
    }

    public void send(Integer memberId, String data) {
        String token = fcmCacheRepository.getToken(memberId);
        if(Objects.nonNull(token)){
            sendNotification(token, data);
        }
    }

    private void sendNotification(String targetToken, String body){
        Message message = Message.builder()
                .setToken(targetToken)
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
