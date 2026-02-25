package com.moong.cache;

import com.moong.domain.ranking.BankRanking;
import com.moong.domain.ranking.key.RedisRankingKey;

import java.util.List;
import java.util.function.Supplier;

public interface RankingCache {

    CacheResult<List<BankRanking>> getRanking(RedisRankingKey rankingKey);

    void markAsEmpty(RedisRankingKey rankingKey);

    void rebuildAsync(RedisRankingKey rankingKey, Supplier<List<BankRanking>> provider);

    void syncToRedis(String rankingKey, List<BankRanking> rankings);

    void updateRanking(RedisRankingKey rankingKey,
                       String rawMemberName,
                       long amount,
                       Supplier<List<BankRanking>> provider);

    void softDeleteRanking(RedisRankingKey rankingKey, long ttlSeconds);
}
