package com.worlabel.global.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 사용자 설정 에러
 */
@Getter
@AllArgsConstructor
public class CustomError {
    /**
     * 에러 발생 필드
     */
    private String field;

    /**
     * 에러 코드
     */
    private String code;

    /**
     * 에러 메시지
     */
    private String message;

    /**
     * 에러 발생 객체
     */
    private String objectName;
}