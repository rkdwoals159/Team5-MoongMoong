package com.moong.domain.ranking;

import com.moong.view.bank.CoinView;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@RequiredArgsConstructor
public class BankRankings {

    private final List<BankRanking> values;

    public static BankRankings fromCoinViews(List<CoinView> coinViews) {
        Map<Long, Long> memberIdToSum = coinViews.stream()
                .collect(Collectors.groupingBy(
                        CoinView::getMemberId,
                        Collectors.summingLong(CoinView::getAmount)
                ));

        Map<Long, String> memberIdToName = coinViews.stream()
                .collect(Collectors.toMap(
                        CoinView::getMemberId,
                        CoinView::getName,
                        (existing, replacement) -> existing
                ));

        return new BankRankings(
                memberIdToSum.entrySet().stream()
                        .map(entry -> new BankRanking(
                                entry.getKey(),
                                memberIdToName.get(entry.getKey()),
                                entry.getValue()
                        ))
                        .sorted(BankRanking.BY_TOTAL_DESC)
                        .toList()
        );
    }

    public static BankRankings emptyBankRankings() {
        return new BankRankings(List.of());
    }
}
