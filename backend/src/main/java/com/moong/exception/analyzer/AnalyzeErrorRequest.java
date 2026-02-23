package com.moong.exception.analyzer;

public record AnalyzeErrorRequest(
        String path,
        String httpMethod,
        Exception exception
) {

}
