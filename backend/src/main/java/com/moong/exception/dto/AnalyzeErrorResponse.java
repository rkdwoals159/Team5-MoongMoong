package com.moong.exception.dto;

public record AnalyzeErrorResponse(
        AnalyzeErrorResult json,
        boolean success,
        String question,
        String chatId,
        String chatMessageId,
        String isStreamValid,
        String sessionId
) {

}
