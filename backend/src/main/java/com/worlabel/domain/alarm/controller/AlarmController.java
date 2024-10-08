package com.worlabel.domain.alarm.controller;

import com.worlabel.domain.alarm.entity.Alarm;
import com.worlabel.domain.alarm.service.AlarmService;
import com.worlabel.domain.auth.entity.dto.AccessTokenResponse;
import com.worlabel.domain.auth.entity.dto.JwtToken;
import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.config.swagger.SwaggerApiError;
import com.worlabel.global.config.swagger.SwaggerApiSuccess;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "알람 관련 API")
@RequestMapping("/api/alarm")
public class AlarmController {

    private final AlarmService alarmService;

    @Operation(summary = "알림 리스트 조회", description = "현재 사용자의 알림 목록을 조회합니다.")
    @SwaggerApiSuccess(description = "알림 목록이 조회됨")
    @SwaggerApiError({ErrorCode.INVALID_TOKEN})
    @GetMapping("")
    public List<Alarm> getAlarmList(@CurrentUser final Integer memberId) {
        return alarmService.getAlarmList(memberId);
    }

    @Operation(summary = "알림 읽음 처리", description = "해당 알림을 읽음처리합니다")
    @SwaggerApiSuccess(description = "알림 읽음 처리")
    @SwaggerApiError({ErrorCode.INVALID_TOKEN})
    @PutMapping("/{alarm_id}")
    public void readAlarm(
            @CurrentUser final Integer memberId,
            @PathVariable("alarm_id") final Long alarmId
    ) {
        alarmService.readAlarm(memberId, alarmId);
    }

    @Operation(summary = "알림 삭제", description = "해당 알림을 삭제합니다.")
    @SwaggerApiSuccess(description = "알림 삭제")
    @SwaggerApiError({ErrorCode.INVALID_TOKEN})
    @DeleteMapping("/{alarm_id}")
    public void deleteAlarm(
            @CurrentUser final Integer memberId,
            @PathVariable("alarm_id") final Long alarmId ) {
        alarmService.deleteAlarm(memberId, alarmId);
    }

    @Operation(summary = "알람 전체 삭제", description = "알람을 전체 삭제합니다.")
    @SwaggerApiSuccess(description = "알람 전체 삭제")
    @SwaggerApiError({ErrorCode.INVALID_TOKEN})
    @DeleteMapping("")
    public void deleteAllAlarm(@CurrentUser final Integer memberId) {
        alarmService.deleteAllAlarm(memberId);
    }

    // TODO: 연동 후 삭제
    @Operation(summary = "알람 테스트 전용", description = "테스트 알람을 10개 생성. 추후 삭제 예정")
    @SwaggerApiSuccess(description = "알람 테스트 생성")
    @SwaggerApiError({ErrorCode.INVALID_TOKEN})
    @PostMapping("/test")
    public void test(@CurrentUser final Integer memberId) {
        alarmService.test(memberId);
    }
}
