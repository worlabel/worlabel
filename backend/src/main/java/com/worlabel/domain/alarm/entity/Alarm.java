package com.worlabel.domain.alarm.entity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Alarm {

    private long id;

    private Boolean isRead;

    private String createdAt;

    private AlarmType type;

    public enum AlarmType{
        PREDICT,
        TRAIN,
        IMAGE,
        COMMENT,
        REVIEW_RESULT,
        REVIEW_REQUEST
    }

    public static Alarm create(long id, AlarmType type) {
        return new Alarm(id, false, LocalDateTime.now().toString(), type);
    }

    public void read(){
        isRead = true;
    }
}
