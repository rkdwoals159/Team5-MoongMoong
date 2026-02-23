package com.moong.cache;

import com.moong.domain.ranking.BankRanking;
import com.moong.domain.ranking.key.RedisRankingKey;
import com.moong.domain.ranking.key.RedisRankingRebuildKey;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

@Disabled
@SpringBootTest
@ActiveProfiles("test")
class RedisRankingCacheTest {
    @Autowired
    private RankingCache rankingCache;

    @Autowired
    private StringRedisTemplate redisTemplate;

    @BeforeEach
    void setUp() {
        redisTemplate.delete("ranking:bank:999");
        redisTemplate.delete("ranking:bank:999" + ":temp");
        redisTemplate.delete(new RedisRankingRebuildKey(999L).value());
    }

    @Test
    @DisplayName("syncToRedis는 기존 데이터를 누적하지 않고 원자적으로 교체해야 한다")
    void prove_SyncToRedis_AtomicallyReplacesData() throws InterruptedException {
        // given
        long bankId = 999L;
        RedisRankingKey rankingKey = new RedisRankingKey(bankId);
        redisTemplate.opsForZSet().add(rankingKey.value(), "OLD_USER", 100);

        List<BankRanking> newList = List.of(new BankRanking(1L, "NEW", 500L));

        // when
        rankingCache.syncToRedis(rankingKey.value(), newList);

        // then
        Set<String> members = redisTemplate.opsForZSet().range(rankingKey.value(), 0, -1);
        assertAll(
                () -> assertThat(members).hasSize(1).contains("1_NEW"),
                () -> assertThat(members).doesNotContain("OLD_USER"),
                () -> assertThat(redisTemplate.hasKey(rankingKey.value() + ":temp")).isFalse()
        );
    }

    @Test
    @DisplayName("EMPTY_MARKER는 Redis에 실재하되 getRanking 결과에서는 제거되어야 한다")
    void prove_EmptyMarker_IsFilteredFromResults() {
        // when
        long bankId = 999L;
        RedisRankingKey rankingKey = new RedisRankingKey(bankId);
        rankingCache.markAsEmpty(rankingKey);

        // then
        CacheResult<List<BankRanking>> result = rankingCache.getRanking(rankingKey);
        assertAll(
                () -> assertThat(result.getStatus()).isEqualTo(CacheStatus.SUCCESS),
                () -> assertThat(result.getData()).isEmpty(),
                () -> assertThat(redisTemplate.opsForZSet().score(rankingKey.value(), "EMPTY_MARKER")).isNotNull()
        );
    }

    @Test
    @DisplayName("동일한 랭킹에 대해 이미 갱신 락이 걸려있으면 추가 요청은 무시된다")
    void prove_RebuildAsync_ConcurrencyLock() throws InterruptedException {
        // given
        long bankId = 999L;
        RedisRankingKey rankingKey = new RedisRankingKey(bankId);
        RedisRankingRebuildKey lockKey = new RedisRankingRebuildKey(bankId);
        redisTemplate.opsForValue().set(lockKey.value(), "L", 10, TimeUnit.SECONDS);

        // when
        rankingCache.rebuildAsync(rankingKey, () -> List.of(new BankRanking(7L, "Ignored", 777L)));

        // then
        Thread.sleep(500);
        assertThat(redisTemplate.opsForZSet().score(rankingKey.value(), "7_Ignored")).isNull();
    }
}
