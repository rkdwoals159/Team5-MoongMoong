package com.moong.domain.bank;

import com.moong.domain.entity.Coin;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Getter;

@Getter
public class BankRankings {

    private static final Comparator<BankRanking> BANK_RANKING_COMPARATOR = Comparator.comparing(BankRanking::getTotal).reversed();;

    private final List<BankRanking> values;

    public BankRankings(List<Coin> coins) {
        //TODO Redis 변경 예정이므로 임시 코드입니다.
        this.values = coins.stream()
                .collect(
                        Collectors.groupingBy(
                                coin -> coin.getCrew().getMember(),
                                Collectors.summingLong(Coin::getAmount)
                        )
                ).entrySet()
                .stream()
                .map(entry -> new BankRanking(entry.getKey().getName(), entry.getValue()))
                .sorted(BANK_RANKING_COMPARATOR)
                .toList();
    }
}
