package com.moong.exception.dto;

public record AnalyzeErrorRequest(
        String path,
        String httpMethod,
        Exception exception
) {

}
