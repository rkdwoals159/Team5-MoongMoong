package com.moong.cache;

import com.moong.domain.bank.BankRanking;
import com.moong.key.ranking.RedisRankingKey;
import com.moong.key.ranking.RedisRankingMemberKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.zset.DefaultTuple;
import org.springframework.data.redis.connection.zset.Tuple;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisRankingCache implements RankingCache {

    private static final long DEFAULT_TTL_SECONDS = 24 * 60 * 60L; // 1일

    private final StringRedisTemplate redisTemplate;

    public Optional<List<BankRanking>> getRanking(RedisRankingKey rankingKey) {
        Set<ZSetOperations.TypedTuple<String>> rankings =
                redisTemplate.opsForZSet().reverseRangeWithScores(rankingKey.value(), 0, -1);

        return Optional.ofNullable(rankings)
                .filter(set -> !set.isEmpty())
                .map(set -> set.stream()
                        .map(tuple -> RedisRankingMemberKey.parse(tuple.getValue())
                                .map(k -> new BankRanking(k.memberId(), k.memberName(), tuple.getScore().longValue()))
                                .orElse(null))
                        .filter(Objects::nonNull)
                        .toList());
    }

    public void rebuildIfEmpty(RedisRankingKey rankingKey, Supplier<List<BankRanking>> rawProvider) {
        syncToRedis(rankingKey.value(), rawProvider.get());
    }

    public void updateRanking(RedisRankingKey rankingKey,
                              String rawMemberName,
                              long amount) {
        redisTemplate.opsForZSet().incrementScore(rankingKey.value(), rawMemberName, amount);
    }

    public void softDeleteRanking(RedisRankingKey rankingKey, long ttlSeconds) {
        redisTemplate.expire(rankingKey.value(), ttlSeconds, TimeUnit.SECONDS);
    }

    private void syncToRedis(String rankingKey, List<BankRanking> rankings) {
        if (rankings.isEmpty()) return;

        Set<Tuple> tuples = rankings.stream()
                .map(r -> new DefaultTuple(
                        new RedisRankingMemberKey(r.getMemberId(), r.getMemberName())
                                .value()
                                .getBytes(StandardCharsets.UTF_8),
                        (double) r.getTotal()
                ))
                .collect(Collectors.toSet());

        redisTemplate.executePipelined((RedisCallback<Object>) connection -> {
            byte[] rawKey = rankingKey.getBytes(StandardCharsets.UTF_8);
            connection.zAdd(rawKey, tuples);
            connection.expire(rawKey, DEFAULT_TTL_SECONDS);
            return null;
        });
        log.info("redis 갱신 완료 : {} ", rankingKey);
    }
}
