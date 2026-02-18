package com.moong.config;

import com.moong.cache.RankingCache;
import com.moong.domain.bank.BankRanking;
import com.moong.key.ranking.RedisRankingKey;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;

@Primary
@Profile("test")
@Component
public class FakeRankingCache implements RankingCache {

    @Override
    public Optional<List<BankRanking>> getRanking(RedisRankingKey rankingKey) {
        return Optional.empty();
    }

    @Override
    public void rebuildIfEmpty(RedisRankingKey rankingKey, Supplier<List<BankRanking>> rawProvider) {

    }

    @Override
    public void updateRanking(RedisRankingKey rankingKey, String rawMemberName, long amount) {

    }

    @Override
    public void softDeleteRanking(RedisRankingKey rankingKey, long ttlSeconds) {

    }
}
