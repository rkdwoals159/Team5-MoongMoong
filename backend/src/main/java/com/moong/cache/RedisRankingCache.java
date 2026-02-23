package com.moong.cache;

import com.moong.domain.ranking.BankRanking;
import com.moong.domain.ranking.key.RedisRankingKey;
import com.moong.domain.ranking.key.RedisRankingMemberKey;
import com.moong.domain.ranking.key.RedisRankingRebuildKey;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.zset.DefaultTuple;
import org.springframework.data.redis.connection.zset.Tuple;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisRankingCache implements RankingCache {

    private static final long HARD_TTL_SECONDS = 48 * 60 * 60L;
    private static final String EMPTY_MARKER = "EMPTY_MARKER";

    private final StringRedisTemplate redisTemplate;

    public CacheResult<List<BankRanking>> getRanking(RedisRankingKey rankingKey) {
        try{
            Set<ZSetOperations.TypedTuple<String>> rankings =
                    redisTemplate.opsForZSet().reverseRangeWithScores(rankingKey.value(), 0, -1);

            if(rankings == null || rankings.isEmpty()){
                return new CacheResult<>(CacheStatus.EMPTY);
            }

            long remainingTtl = redisTemplate.getExpire(rankingKey.value(), TimeUnit.SECONDS);
            List<BankRanking> data = rankings.stream()
                    .filter(tuple -> !EMPTY_MARKER.equals(tuple.getValue()))
                    .map(tuple -> RedisRankingMemberKey.parse(tuple.getValue())
                            .map(k -> new BankRanking(k.memberId(), k.memberName(), tuple.getScore().longValue()))
                            .orElse(null))
                    .filter(Objects::nonNull)
                    .toList();

            return new CacheResult<>(data,  CacheStatus.SUCCESS, remainingTtl);
        } catch (Exception e) {
            log.error("Redis 조회 장애 발생 - bankId: {}, {}", rankingKey.bankId(), e.getMessage(), e);
            return new CacheResult<>(CacheStatus.ERROR);
        }
    }

    public void markAsEmpty(RedisRankingKey rankingKey) {
        redisTemplate.opsForZSet().add(rankingKey.value(), EMPTY_MARKER, 0);
        redisTemplate.expire(rankingKey.value(), HARD_TTL_SECONDS, TimeUnit.SECONDS);
    }

    @Async("rankingRebuildExecutor")
    public void rebuildAsync(RedisRankingKey rankingKey, Supplier<List<BankRanking>> provider) {
        RedisRankingRebuildKey rebuildKey = new RedisRankingRebuildKey(rankingKey.bankId());
        Boolean acquired = redisTemplate.opsForValue().setIfAbsent(rebuildKey.value(), "L", 2, TimeUnit.MINUTES);

        if (Boolean.TRUE.equals(acquired)) {
            try {
                syncToRedis(rankingKey.value(), provider.get());
            } finally {
                redisTemplate.delete(rebuildKey.value());
            }
        }
    }

    public void syncToRedis(String rankingKey, List<BankRanking> rankings) {
        if (rankings.isEmpty()) return;

        String tempKey = rankingKey + ":temp";

        Set<Tuple> tuples = rankings.stream()
                .map(r -> new DefaultTuple(
                        new RedisRankingMemberKey(r.getMemberId(), r.getMemberName())
                                .value()
                                .getBytes(StandardCharsets.UTF_8),
                        (double) r.getTotal()
                ))
                .collect(Collectors.toSet());

        redisTemplate.executePipelined((RedisCallback<Object>) connection -> {
            byte[] rawTempKey = tempKey.getBytes(StandardCharsets.UTF_8);
            byte[] rawKey = rankingKey.getBytes(StandardCharsets.UTF_8);
            connection.zAdd(rawTempKey, tuples);
            connection.expire(rawTempKey, HARD_TTL_SECONDS); // 저장할 때마다 2일 연장
            connection.keyCommands().rename(rawTempKey, rawKey);
            return null;
        });
        log.info("redis 갱신 완료 : {} ", rankingKey);
    }

    public void updateRanking(RedisRankingKey rankingKey,
                              String rawMemberName,
                              long amount) {
        try{
            redisTemplate.opsForZSet().incrementScore(rankingKey.value(), rawMemberName, amount);
        } catch (Exception e) {
            log.error("update ranking error - bankId: {}, {}", rankingKey.bankId(), e.getMessage(), e);
        }
    }

    public void softDeleteRanking(RedisRankingKey rankingKey, long ttlSeconds) {
        redisTemplate.expire(rankingKey.value(), ttlSeconds, TimeUnit.SECONDS);
    }
}
