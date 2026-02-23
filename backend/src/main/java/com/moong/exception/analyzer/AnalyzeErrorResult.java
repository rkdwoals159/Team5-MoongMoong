package com.moong.exception.analyzer;

public record AnalyzeErrorResult(
        String action,
        String reason,
        String guide,
        String inference
) {

}
