package com.moong.exception.analyzer;

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
