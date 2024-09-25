package com.worlabel.domain.alarm.repository;

import com.google.gson.Gson;
import com.worlabel.domain.alarm.entity.Alarm;
import com.worlabel.domain.alarm.entity.Alarm.AlarmType;
import com.worlabel.global.cache.CacheKey;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class AlarmCacheRepository {

    private final RedisTemplate<String, String> redisTemplate;
    private final Gson gson;

    private final long ttlInSeconds = 10000L;

    public void save(int memberId, AlarmType type) {
        Long alarmId = redisTemplate.opsForValue().increment(CacheKey.alarmIdKey());

        // 알람 생성
        Alarm alarm = Alarm.create(alarmId, type);
        String jsonAlarm = gson.toJson(alarm);

        // Redis에 저장 (개별 키에 TTL 설정)
        String key = CacheKey.alarmMemberKey(memberId, alarmId);
        redisTemplate.opsForValue().set(key, jsonAlarm, ttlInSeconds, TimeUnit.SECONDS);
    }

    // 알람 리스트 조회 (ID나 타임스탬프 기준으로 정렬)
    public List<Alarm> getAlarmList(int memberId) {
        // 멤버에 해당하는 모든 알람 키 가져오기
        String key = CacheKey.alarmMemberAllKey(memberId);
        Set<String> keys = redisTemplate.keys(key);

        if(keys == null || keys.isEmpty()){
            return List.of();
        }

        return keys.stream()
                .map(alarmKey -> redisTemplate.opsForValue().get(alarmKey))
                .map(this::converter)
                .sorted(Comparator.comparing(Alarm::getId))
                .toList();
    }

    // 특정 알람 삭제
    public void deleteAlarm(int memberId, long alarmId) {
        String key = CacheKey.alarmMemberKey(memberId, alarmId);
        redisTemplate.delete(key);
    }

    public void deleteAllAlarm(int memberId) {
        String key = CacheKey.alarmMemberAllKey(memberId);
        Set<String> keys = redisTemplate.keys(key);  // 해당 패턴으로 키 조회
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);  // 모든 키 삭제
        }
    }

    // 특정 알람의 상태 변경 (읽음 처리)
    public void readAlarm(int memberId, long alarmId) {
        String key = CacheKey.alarmMemberKey(memberId, alarmId);
        Alarm alarm = getAlarm(memberId, alarmId);

        if (alarm != null) {
            // 읽음 상태로 변경 후 다시 저장
            alarm.read();
            String jsonAlarm = gson.toJson(alarm);
            redisTemplate.opsForValue().set(key, jsonAlarm);
        }
    }

    // 특정 알람 조회
    private Alarm getAlarm(int memberId, long alarmId) {
        String key = CacheKey.alarmMemberKey(memberId, alarmId);
        String jsonAlarm = redisTemplate.opsForValue().get(key);
        return converter(jsonAlarm);
    }

    // JSON을 Alarm 객체로 변환하는 메서드
    private Alarm converter(String jsonAlarm) {
        return gson.fromJson(jsonAlarm, Alarm.class);
    }

}
