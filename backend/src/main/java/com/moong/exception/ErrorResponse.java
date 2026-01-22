package com.moong.exception;

import com.moong.exception.errorcode.ErrorCode;
import org.springframework.http.HttpStatus;

public record ErrorResponse(
        String code,
        String status,
        String message
) {

    public ErrorResponse(ErrorCode errorCode) {
        this(
                errorCode.name(),
                HttpStatus.valueOf(errorCode.getStatusCode()).name(),
                errorCode.getMessage()
        );
    }
}
