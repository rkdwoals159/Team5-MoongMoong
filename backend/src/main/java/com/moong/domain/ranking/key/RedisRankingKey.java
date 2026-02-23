package com.moong.domain.ranking.key;

public record RedisRankingKey(long bankId) {

    private static final String PREFIX = "ranking:bank:";

    public String value() {
        return PREFIX + bankId;
    }
}
