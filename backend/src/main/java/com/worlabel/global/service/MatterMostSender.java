package com.worlabel.global.service;

import com.google.gson.Gson;
import com.worlabel.global.mattermost.MattermostProperties;
import com.worlabel.global.mattermost.dto.MatterMostMessageDto.Attachment;
import com.worlabel.global.mattermost.dto.MatterMostMessageDto.Attachments;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
@RequiredArgsConstructor
public class MatterMostSender {

    @Value("${notification.mattermost.enabled}")
    private boolean mmEnabled;
    @Value("${notification.mattermost.webhook-url}")
    private String webhookUrl;

    private final RestTemplateBuilder restTemplateBuilder;
    private final MattermostProperties mmProperties;

    public void sendMessage(Exception excpetion, String uri, String params) {
        if (!mmEnabled)
            return;

        try {
            RestTemplate restTemplate = restTemplateBuilder.build();

            Attachment attachment = Attachment.builder()
                    .channel(mmProperties.getChannel())
                    .authorIcon(mmProperties.getAuthorIcon())
                    .authorName(mmProperties.getAuthorName())
                    .color(mmProperties.getColor())
                    .pretext(mmProperties.getPretext())
                    .title(mmProperties.getTitle())
                    .text(mmProperties.getText())
                    .footer(mmProperties.getFooter())
                    .build();

            attachment.addExceptionInfo(excpetion, uri, params);
            Attachments attachments = new Attachments(attachment);
            attachments.addProps(excpetion);
            String payload = new Gson().toJson(attachments);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-type", MediaType.APPLICATION_JSON_VALUE);

            HttpEntity<String> entity = new HttpEntity<>(payload, headers);
            restTemplate.postForEntity(webhookUrl, entity, String.class);
        } catch (Exception e) {
            log.error("#### ERROR!! Notification Manager : {}", e.getMessage());
        }

    }
}
