package com.moong.service.ranking;

import com.moong.cache.CacheResult;
import com.moong.cache.RankingCache;
import com.moong.domain.ranking.BankRanking;
import com.moong.domain.ranking.BankRankings;
import com.moong.domain.bank.Bank;
import com.moong.domain.crew.Crew;
import com.moong.domain.member.Member;
import com.moong.domain.ranking.key.RedisRankingKey;
import com.moong.repository.bank.BankRepository;
import com.moong.repository.bank.CoinRepository;
import com.moong.repository.crew.CrewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RankingService {

    private static final long REFRESH_BLOCK_THRESHOLD = 30L;
    private static final long SOFT_TTL = 24 * 60 * 60L;

    private final RankingCache rankingCache;
    private final CoinRepository coinRepository;
    private final CrewRepository crewRepository;
    private final BankRepository bankRepository;

    public BankRankings getRanking(long bankId, boolean isCurrentAmountZero) {
        RedisRankingKey rankingKey = new RedisRankingKey(bankId);
        CacheResult<List<BankRanking>> result = rankingCache.getRanking(rankingKey);

        if(result.isError()){
            return BankRankings.emptyBankRankings();
        }

        if(result.isEmpty()){
            if(isCurrentAmountZero){
                rankingCache.markAsEmpty(rankingKey);
                return BankRankings.emptyBankRankings();
            }

            log.info("Ranking cache miss: Sync DB fetch - bankId: {}", bankId);
            List<BankRanking> rankings = fetchFromDb(bankId);
            rankingCache.syncToRedis(rankingKey.value(), rankings);
            return new BankRankings(rankings);
        }

        if (!result.getData().isEmpty() && result.isStale(SOFT_TTL) && result.isSafeToRefresh(REFRESH_BLOCK_THRESHOLD)) { // Soft TTL 만료
            rankingCache.rebuildAsync(rankingKey, () -> fetchFromDb(bankId));
        }

        return new BankRankings(result.getData());
    }

    private List<BankRanking> fetchFromDb(long bankId) {
        return BankRanking.fromCoinViews(coinRepository.getFetchedAllByBank_Id(bankId, Sort.unsorted()));
    }

    public void updateRanking(Member member, long amount) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        Bank bank = bankRepository.getByPetGroupId(crew.getPetGroup().getId());
        String rawMemberName = member.getId() + "_" + member.getName();

        try {
            rankingCache.updateRanking(
                    new RedisRankingKey(bank.getId()),
                    rawMemberName,
                    amount
            );
        } catch (Exception e) {
            log.error("Ranking update error - bankId: {}, {}", bank.getId(), e.getMessage(), e);
        }
        log.info("Ranking update success - bankId: {}", bank.getId());
    }

    public void deleteRanking(long bankId) {
        rankingCache.softDeleteRanking(new RedisRankingKey(bankId), REFRESH_BLOCK_THRESHOLD);
        log.info("Ranking delete success - bankId: {}", bankId);
    }
}
