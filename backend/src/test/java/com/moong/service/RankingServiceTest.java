package com.moong.service;

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
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
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
        when(rankingCache.getRanking(rankingKey)).thenReturn(Optional.of(raw));

        BankRankings rankings = rankingService.getRanking(bankId);

        assertAll(
                () -> assertThat(rankings).isNotNull(),
                () -> verify(rankingCache).getRanking(rankingKey),
                () -> verify(coinRepository, never()).getFetchedAllByBank_Id(anyLong(), any(Sort.class)),
                () -> verify(rankingCache, never()).rebuildIfEmpty(any(RedisRankingKey.class), any())
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

        when(rankingCache.getRanking(rankingKey)).thenReturn(Optional.empty());
        when(coinRepository.getFetchedAllByBank_Id(eq(bankId), any(Sort.class)))
                .thenReturn(coinViews);

        BankRankings result = rankingService.getRanking(bankId);

        assertAll(
                () -> assertThat(result).isNotNull(),
                () -> verify(rankingCache).getRanking(rankingKey),
                () -> verify(coinRepository).getFetchedAllByBank_Id(eq(bankId), any(Sort.class)),
                () -> verify(rankingCache).rebuildIfEmpty(any(RedisRankingKey.class), any())
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

        verify(rankingCache).softDeleteRanking(new RedisRankingKey(1L), 5L);
    }
}
