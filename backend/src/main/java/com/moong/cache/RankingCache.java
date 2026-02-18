package com.moong.cache;

import com.moong.domain.bank.BankRanking;
import com.moong.key.ranking.RedisRankingKey;

import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;

public interface RankingCache {

    Optional<List<BankRanking>> getRanking(RedisRankingKey rankingKey);

    void rebuildIfEmpty(RedisRankingKey rankingKey, Supplier<List<BankRanking>> rawProvider);

    void updateRanking(RedisRankingKey rankingKey,
                       String rawMemberName,
                       long amount);

    void softDeleteRanking(RedisRankingKey rankingKey, long ttlSeconds);
}
