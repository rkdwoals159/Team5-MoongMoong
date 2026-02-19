package com.moong.domain.report;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import com.moong.domain.enums.MainCategoryType;
import com.moong.dto.response.memberexpense.ExpenseCategoryStatics;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ExpenseCategoryRankingsTest {

    @DisplayName("소비 카테고리 상위 3개 랭킹을 비용순으로 정렬하여 가진다")
    @Test
    void expenseCategoryRankingsTest() {
        List<ExpenseCategoryStatics> values = List.of(
                new ExpenseCategoryStatics(MainCategoryType.MEDICAL_EXPENSES, 10L),
                new ExpenseCategoryStatics(MainCategoryType.FOOD_AND_TREATS, 20L),
                new ExpenseCategoryStatics(MainCategoryType.GROOMING, 30L),
                new ExpenseCategoryStatics(MainCategoryType.SUPPLIES, 40L)
        );

        ExpenseCategoryRankings rankings = new ExpenseCategoryRankings(values);

        assertThat(rankings.getValues())
                .extracting(ExpenseCategoryRanking::category)
                .containsExactly(
                        MainCategoryType.SUPPLIES.getDescription(),
                        MainCategoryType.GROOMING.getDescription(),
                        MainCategoryType.FOOD_AND_TREATS.getDescription()
                );
    }
}
