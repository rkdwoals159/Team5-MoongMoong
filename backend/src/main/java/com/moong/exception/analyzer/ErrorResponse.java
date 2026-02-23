package com.moong.exception.analyzer;

public record ErrorResponse(
        String code,
        int status,
        String message
) {

}
