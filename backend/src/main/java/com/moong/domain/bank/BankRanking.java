package com.moong.domain.bank;

import com.moong.key.ranking.RedisRankingMemberKey;
import com.moong.view.bank.CoinView;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@RequiredArgsConstructor
public class BankRanking {

    private final long memberId;
    private final String memberName;
    private final long total;

    public static final Comparator<BankRanking> BY_TOTAL_DESC = Comparator.comparingLong(BankRanking::getTotal).reversed();

    public static List<BankRanking> fromCoinViews(List<CoinView> views) {
        return views.stream()
                .collect(Collectors.toMap(
                        view -> new RedisRankingMemberKey(view.getMemberId(), view.getName()),
                        CoinView::getAmount,
                        Long::sum
                ))
                .entrySet().stream()
                .map(e -> new BankRanking(
                        e.getKey().memberId(),
                        e.getKey().memberName(),
                        e.getValue()
                ))
                .toList();
    }
}
