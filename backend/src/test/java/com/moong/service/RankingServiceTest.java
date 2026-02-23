package com.moong.service;

import com.moong.cache.CacheResult;
import com.moong.cache.CacheStatus;
import com.moong.cache.RankingCache;
import com.moong.domain.bank.BankRanking;
import com.moong.domain.bank.BankRankings;
import com.moong.domain.entity.Bank;
import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.key.ranking.RedisRankingKey;
import com.moong.repository.CoinRepository;
import com.moong.view.bank.CoinView;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class RankingServiceTest extends BaseServiceTest {

    @MockitoBean
    private RankingCache rankingCache;

    @MockitoBean
    private CoinRepository coinRepository;

    @Autowired
    private RankingService rankingService;

    @DisplayName("캐시에 랭킹 데이터가 존재하면 DB 조회를 하지 않는다")
    @Test
    void shouldNotQueryDatabase_whenCacheHit() {
        long bankId = 1L;
        List<BankRanking> raw = List.of(
                new BankRanking(1L, "하이", 100L),
                new BankRanking(2L, "하이하이", 50L)
        );

        RedisRankingKey rankingKey = new RedisRankingKey(bankId);
        CacheResult<List<BankRanking>> cacheHit = new CacheResult<>(raw, CacheStatus.SUCCESS, 40 * 60 * 60L);
        when(rankingCache.getRanking(rankingKey)).thenReturn(cacheHit);

        BankRankings rankings = rankingService.getRanking(bankId, false);

        assertAll(
                () -> assertThat(rankings).isNotNull(),
                () -> verify(rankingCache).getRanking(rankingKey),
                () -> verify(coinRepository, never()).getFetchedAllByBank_Id(anyLong(), any(Sort.class)),
                () -> verify(rankingCache, never()).rebuildAsync(any(), any())
        );
    }

    @DisplayName("캐시에 랭킹 데이터가 없으면 DB 조회 후 캐시를 재구성한다")
    @Test
    void shouldQueryDatabaseAndRebuildCache_whenCacheMiss() {
        long bankId = 1L;

        List<CoinView> coinViews = List.of(
                new CoinView(1L, "A", 100L, null),
                new CoinView(2L, "B", 50L, null)
        );
        RedisRankingKey rankingKey = new RedisRankingKey(bankId);

        when(rankingCache.getRanking(rankingKey))
                .thenReturn(new CacheResult<>(CacheStatus.EMPTY));
        when(coinRepository.getFetchedAllByBank_Id(eq(bankId), any(Sort.class)))
                .thenReturn(coinViews);

        BankRankings result = rankingService.getRanking(bankId, false);

        assertAll(
                () -> assertThat(result).isNotNull(),
                () -> verify(rankingCache).getRanking(rankingKey),
                () -> verify(coinRepository).getFetchedAllByBank_Id(eq(bankId), any(Sort.class)),
                () -> verify(rankingCache).syncToRedis(eq(rankingKey.value()), anyList()),
                () -> verify(rankingCache, never()).rebuildAsync(any(), any())
        );
    }

    @DisplayName("캐시가 비어있고 저금통 잔액이 0원이면 DB 조회 대신 빈 랭킹키를 생성한다")
    @Test
    void shouldMarkAsEmpty_whenCacheMissAndAmountZero() {
        // given
        long bankId = 1L;
        boolean isCurrentAmountZero = true;
        RedisRankingKey rankingKey = new RedisRankingKey(bankId);

        when(rankingCache.getRanking(rankingKey)).thenReturn(new CacheResult<>(CacheStatus.EMPTY));

        // when
        BankRankings result = rankingService.getRanking(bankId, isCurrentAmountZero);

        // then
        assertAll(
                () -> assertThat(result.getValues()).isEmpty(),
                () -> verify(rankingCache).getRanking(rankingKey),
                () -> verify(coinRepository, never()).getFetchedAllByBank_Id(anyLong(), any()),
                () -> verify(rankingCache).markAsEmpty(rankingKey)
        );
    }

    @DisplayName("캐시의 Soft TTL이 지났다면 비동기 갱신을 수행한다")
    @Test
    void shouldRebuildAsync_whenCacheIsStaleWithData() {
        // given
        long bankId = 1L;
        RedisRankingKey rankingKey = new RedisRankingKey(bankId);
        List<BankRanking> staleData = List.of(new BankRanking(1L, "올드비", 100L));

        CacheResult<List<BankRanking>> staleHit = new CacheResult<>(staleData, CacheStatus.SUCCESS, 10 * 60 * 60L);
        when(rankingCache.getRanking(rankingKey)).thenReturn(staleHit);

        // when
        BankRankings result = rankingService.getRanking(bankId, false);

        // then
        assertAll(
                () -> assertThat(result.getValues()).hasSize(1),
                () -> verify(rankingCache).getRanking(rankingKey),
                () -> verify(rankingCache).rebuildAsync(eq(rankingKey), any())
        );
    }

    @DisplayName("캐시의 Soft TTL이 지났더라도 저금통 잔액이 0원이면 랭킹이 존재하지 않으므로 비동기 갱신을 건너뛴다")
    @Test
    void shouldNotRebuildAsync_whenCacheIsStaleButEmptyMarker() {
        // given
        long bankId = 1L;
        RedisRankingKey rankingKey = new RedisRankingKey(bankId);

        CacheResult<List<BankRanking>> emptyMarkerHit = new CacheResult<>(List.of(), CacheStatus.SUCCESS, 10 * 60 * 60L);
        when(rankingCache.getRanking(rankingKey)).thenReturn(emptyMarkerHit);

        // when
        BankRankings result = rankingService.getRanking(bankId, true);

        // then
        assertAll(
                () -> assertThat(result.getValues()).isEmpty(),
                () -> verify(rankingCache, never()).rebuildAsync(any(), any()),
                () -> verify(coinRepository, never()).getFetchedAllByBank_Id(anyLong(), any())
        );
    }

    @DisplayName("Redis 장애 발생 시 DB 조회를 하지 않고 빈 결과를 반환한다")
    @Test
    void shouldProtectDatabase_whenRedisError() {
        // given
        long bankId = 1L;
        boolean isCurrentAmountZero = false;
        RedisRankingKey rankingKey = new RedisRankingKey(bankId);
        CacheResult<List<BankRanking>> cacheError = new CacheResult<>(CacheStatus.ERROR);
        when(rankingCache.getRanking(rankingKey)).thenReturn(cacheError);

        // when
        BankRankings rankings = rankingService.getRanking(bankId, isCurrentAmountZero);

        // then
        assertAll(
                () -> assertThat(rankings.getValues()).isEmpty(),
                () -> verify(rankingCache).getRanking(rankingKey),
                () -> verify(coinRepository, never()).getFetchedAllByBank_Id(anyLong(), any(Sort.class)),
                () -> verify(rankingCache, never()).syncToRedis(anyString(), anyList())
        );
    }

    @DisplayName("저금 발생 시 멤버 정보를 기반으로 랭킹 캐시에 점수를 반영한다")
    @Test
    void shouldUpdateRankingCache_whenDepositOccurs() {
        Member member = memberGenerator.generateSaved("연진");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        Bank bank = bankGenerator.generateSaved(petGroup, 1000L, 500L);

        rankingService.updateRanking(member, 500L);

        String rawMemberName = member.getId() + "_" + member.getName();
        verify(rankingCache).updateRanking(new RedisRankingKey(bank.getId()), rawMemberName, 500L);
    }

    @DisplayName("랭킹 삭제 요청 시 지정된 TTL로 캐시를 만료 처리한다")
    @Test
    void shouldSoftDeleteRankingWithTTL() {
        rankingService.deleteRanking(1L);

        verify(rankingCache).softDeleteRanking(new RedisRankingKey(1L), 30L);
    }
}
