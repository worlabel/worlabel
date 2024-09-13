package com.worlabel.global.response;

import org.springframework.http.HttpStatus;

/**
 * 성공시 응답 객체
 *
 * @param <T> 응답 데이터 타입
 */
public class SuccessResponse<T> extends BaseResponse<T> {
    /**
     * 빈 응답 데이터 - 객체 생성시 보내는 빈 응답 데이터
     */
    private static final SuccessResponse<Void> EMPTY = new SuccessResponse<>();

    /**
     * 성공 응답 객체 생성자
     */
    public SuccessResponse() {
        super(true, HttpStatus.OK.value(), 200, "success");
    }

    /**
     * 성공 응답 객체
     *
     * @param data 성공시 반환하는 데이터
     */
    public SuccessResponse(T data) {
        super(true, 200, 200, "success");
        super.data = data;
    }

    /**
     * 빈 응답 리턴
     *
     * @return 빈 응답 객체
     */
    public static SuccessResponse<Void> empty() {
        return EMPTY;
    }

    /**
     * 데이터를 성공 응답 객체에 감싸서 보내는 메서드
     *
     * @param data 응답 할 데이터
     * @param <T>  응답 할 데이터 타입
     * @return 데이터를 감싼 응답 객체
     */
    public static <T> SuccessResponse<T> of(T data) {
        return new SuccessResponse<T>(data);
    }

}