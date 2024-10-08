package com.worlabel.domain.alarm.service;

import com.worlabel.domain.alarm.entity.Alarm;
import com.worlabel.domain.alarm.entity.Alarm.AlarmType;
import com.worlabel.domain.alarm.repository.AlarmCacheRepository;
import com.worlabel.global.service.FcmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlarmService {

    private final AlarmCacheRepository alarmCacheRepository;
    private final FcmService fcmService;

    public void save(int memberId, AlarmType type) {
        log.debug("알람 전송 memberId {}, type {}", memberId, type);
        alarmCacheRepository.save(memberId, type);
        fcmService.send(memberId, type.toString());
    }

    public List<Alarm> getAlarmList(int memberId){
        return alarmCacheRepository.getAlarmList(memberId);
    }

    public void deleteAlarm(int memberId, long alarmId){
        alarmCacheRepository.deleteAlarm(memberId, alarmId);
    }

    public void readAlarm(int memberId, long alarmId){
        alarmCacheRepository.readAlarm(memberId, alarmId);
    }

    public void deleteAllAlarm(int memberId){
        alarmCacheRepository.deleteAllAlarm(memberId);
    }

    public void test(int memberId) {
        // 3가지 알람 타입 배열을 정의
        AlarmType[] alarmTypes = {AlarmType.PREDICT, AlarmType.TRAIN, AlarmType.IMAGE};

        // 10개의 알람 생성
        for(int i = 0; i < 10; i++) {
            // i % 3을 사용하여 순차적으로 3개의 AlarmType을 선택
            AlarmType selectedType = alarmTypes[i % alarmTypes.length];
            save(memberId, selectedType);
        }
    }

}
