package com.moong.exception.dto;

public record AnalyzeErrorResult(
        String action,
        String reason,
        String guide,
        String inference
) {

}
