package com.moong.domain.bank;

import com.moong.domain.ranking.BankRanking;
import com.moong.domain.ranking.BankRankings;
import com.moong.view.bank.CoinView;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

class BankRankingsTest {

    @DisplayName("memberId별 저금 총액 합산 후 내림차순으로 정렬한다")
    @Test
    void fromCoinViews_groupAndSort() {
        // given
        List<CoinView> coinViews = List.of(
                new CoinView(1L, "A", 100L, null),
                new CoinView(1L, "A", 50L, null),
                new CoinView(2L, "B", 10L, null),
                new CoinView(3L, "C", 200L, null),
                new CoinView(2L, "B", 70L, null)
        );

        // when
        BankRankings rankings = BankRankings.fromCoinViews(coinViews);
        List<BankRanking> values = rankings.getValues();

        // then
        assertAll(
                () -> assertThat(values).hasSize(3),

                () -> assertThat(values.get(0).getMemberName()).isEqualTo("C"),
                () -> assertThat(values.get(0).getTotal()).isEqualTo(200L),

                () -> assertThat(values.get(1).getMemberName()).isEqualTo("A"),
                () -> assertThat(values.get(1).getTotal()).isEqualTo(150L),

                () -> assertThat(values.get(2).getMemberName()).isEqualTo("B"),
                () -> assertThat(values.get(2).getTotal()).isEqualTo(80L)
        );
    }
}
