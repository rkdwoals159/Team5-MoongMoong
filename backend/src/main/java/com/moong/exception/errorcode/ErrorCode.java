package com.moong.exception.errorcode;

import lombok.Getter;

@Getter
public enum ErrorCode {

    //4XX
    UNAUTHORIZED_EXCEPTION(401, "잘못된 유저 접근입니다"),
    FIELD_ERROR(400, "입력이 잘못되었습니다."),
    URL_PARAMETER_ERROR(400, "입력이 잘못되었습니다."),
    METHOD_ARGUMENT_TYPE_MISMATCH(400, "입력한 값의 타입이 잘못되었습니다."),
    CREW_NOT_FOUND(404, "해당하는 크루를 찾을 수 없습니다."),
    NO_RESOURCE_FOUND(404, "요청한 리소스를 찾을 수 없습니다."),
    NO_SUCH_PET_FOUND(404, "PET을 찾을 수 없습니다."),
    METHOD_NOT_SUPPORTED(405, "허용되지 않은 메서드입니다."),
    MEDIA_TYPE_NOT_SUPPORTED(415, "허용되지 않은 미디어 타입입니다."),
    ALREADY_DISCONNECTED(400, "이미 클라이언트에서 요청이 종료되었습니다."),
    INVALID_DATE_RANGE(400, "시작일은 종료일보다 늦을 수 없습니다."),

    //5XX
    INTERNAL_SERVER_ERROR(500, "서버 오류가 발생했습니다. 관리자에게 문의하세요."),
    ;

    private final int statusCode;
    private final String message;

    ErrorCode(int statusCode, String message) {
        this.statusCode = statusCode;
        this.message = message;
    }
}
