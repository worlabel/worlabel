package com.worlabel.global.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class FCMConfig {

    // Firebase 설정 Json 파일의 경로
    @Value("${fcm.config.path}")
    private String FIREBASE_CONFIG_PATH;

    @Bean
    FirebaseMessaging firebaseMessaging() {
        // 클래스패스에서 Firebase 설정 파일을 리소스로 불러옴
        ClassPathResource resource = new ClassPathResource(FIREBASE_CONFIG_PATH);

        // JSON 파일에서 자격 증명을 불러와 Firebase 옵션을 설정
        try (InputStream serviceAccount = resource.getInputStream()) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            // FirebaseApp 인스턴스가 초기화되지 않은 경우 초기화, 이미 존재하는 경우 해당 인스턴스를 가져옴
            FirebaseApp firebaseApp = FirebaseApp.getApps().isEmpty() ?
                    FirebaseApp.initializeApp(options) :
                    FirebaseApp.getInstance();
            // 설정된 FirebaseApp 연결된 FirebaseMessaging 인스턴스를 반환
            return FirebaseMessaging.getInstance(firebaseApp);
        } catch (IOException e) {
            throw new CustomException(ErrorCode.SERVER_ERROR, "Firebase Key 불러오기 실패 ");
        }
    }
}
