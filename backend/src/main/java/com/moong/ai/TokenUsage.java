package com.moong.ai;

//TODO 토큰 사용량 저장 및 모니터링 환경 구축 예정
public record TokenUsage(
        long inputToken,
        long outputToken,
        long totalToken
) {

    public static TokenUsage zeroUsage() {
        return new TokenUsage(0L, 0L, 0L);
    }

}
