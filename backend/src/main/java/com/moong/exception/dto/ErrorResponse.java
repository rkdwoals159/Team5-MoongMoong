package com.moong.exception.dto;

public record ErrorResponse(
        String code,
        int status,
        String message
) {

}
