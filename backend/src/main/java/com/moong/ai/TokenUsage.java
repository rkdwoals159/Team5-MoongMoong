package com.moong.ai;

public record TokenUsage(
        long inputToken,
        long outputToken,
        long totalToken
) {

    public static TokenUsage zeroUsage() {
        return new TokenUsage(0L, 0L, 0L);
    }

}
