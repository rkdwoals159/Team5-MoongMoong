package com.moong.domain.ranking.key;

public record RedisRankingRebuildKey(long bankId) {

    private static final String PREFIX = "lock:rebuild:bank:";

    public String value() {
        return PREFIX + bankId;
    }
}
