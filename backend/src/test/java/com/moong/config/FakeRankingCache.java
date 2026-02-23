package com.moong.config;

import com.moong.cache.CacheResult;
import com.moong.cache.CacheStatus;
import com.moong.cache.RankingCache;
import com.moong.domain.bank.BankRanking;
import com.moong.key.ranking.RedisRankingKey;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Supplier;

@Primary
@Profile("test")
@Component
public class FakeRankingCache implements RankingCache {

    @Override
    public CacheResult<List<BankRanking>> getRanking(RedisRankingKey rankingKey) {
        return new CacheResult<>(CacheStatus.EMPTY);
    }

    @Override
    public void markAsEmpty(RedisRankingKey rankingKey) {

    }

    @Override
    public void rebuildAsync(RedisRankingKey rankingKey, Supplier<List<BankRanking>> provider) {

    }

    @Override
    public void syncToRedis(String rankingKey, List<BankRanking> rankings) {

    }

    @Override
    public void updateRanking(RedisRankingKey rankingKey, String rawMemberName, long amount) {

    }

    @Override
    public void softDeleteRanking(RedisRankingKey rankingKey, long ttlSeconds) {

    }
}
