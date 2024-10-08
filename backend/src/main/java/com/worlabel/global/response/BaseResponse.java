package com.worlabel.global.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.Gson;
import lombok.Getter;
import lombok.ToString;

import java.util.List;
import java.util.ArrayList;

/**
 * 응답 형식
 *
 * @param <T> 응답 데이터 형식
 */
@Getter
@ToString
public abstract class BaseResponse<T> {
    /**
     * 성공 여부
     */
    @Getter(onMethod_ = @JsonProperty("isSuccess"))
    private boolean isSuccess;

    /**
     * 상태 코드
     */
    private int status;

    /**
     * 응답 코드
     */
    private int code;

    /**
     * 응답 메시지
     */
    private String message;

    /**
     * 응답 데이터
     */
    protected T data;

    /**
     * 에러 리스트
     */
    protected List<CustomError> errors;

    public BaseResponse(boolean isSuccess, int status, int code, String message) {
        this.isSuccess = isSuccess;
        this.status = status;
        this.code = code;
        this.message = message;
        this.data = null;
        this.errors = new ArrayList<>();
    }

    /**
     * Json으로 변환 -> 추후 테스트 코드를 위해 존재
     *
     * @return 문자열로 변환된 객체
     */
    public String toJson() {
        return new Gson().toJson(this);
    }
}