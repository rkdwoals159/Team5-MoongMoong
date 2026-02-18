package com.moong.service;

import com.moong.cache.RankingCache;
import com.moong.domain.bank.BankRanking;
import com.moong.domain.bank.BankRankings;
import com.moong.domain.entity.Bank;
import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.key.ranking.RedisRankingKey;
import com.moong.repository.BankRepository;
import com.moong.repository.CoinRepository;
import com.moong.repository.CrewRepository;
import com.moong.view.bank.CoinView;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RankingService {

    private static final long DEFAULT_RANKING_TTL_SECONDS = 5L;

    private final RankingCache rankingCache;
    private final CoinRepository coinRepository;
    private final CrewRepository crewRepository;
    private final BankRepository bankRepository;

    public BankRankings getRanking(long bankId) {
        return rankingCache.getRanking(new RedisRankingKey(bankId))
                .map(BankRankings::new)
                .orElseGet(() -> {
                    log.info("Ranking cache miss - bankId: {}", bankId);
                    List<CoinView> coinViews = coinRepository.getFetchedAllByBank_Id(bankId, Sort.unsorted());

                    rankingCache.rebuildIfEmpty(new RedisRankingKey(bankId), () -> BankRanking.fromCoinViews(coinViews)); // 캐시 적재 시도

                    return BankRankings.fromCoinViews(coinViews);
                });
    }

    public void updateRanking(Member member, long amount) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        Bank bank = bankRepository.getByPetGroupId(crew.getPetGroup().getId());
        String rawMemberName = member.getId() + "_" + member.getName();

        rankingCache.updateRanking(
                new RedisRankingKey(bank.getId()),
                rawMemberName,
                amount
        );
        log.info("Ranking update success - bankId: {}", bank.getId());
    }

    public void deleteRanking(long bankId) {
        rankingCache.softDeleteRanking(new RedisRankingKey(bankId), DEFAULT_RANKING_TTL_SECONDS);
        log.info("Ranking delete success - bankId: {}", bankId);
    }
}
