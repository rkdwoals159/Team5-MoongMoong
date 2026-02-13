package com.moong.domain.groupexpense;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CategoryCostsTest {


    @DisplayName("메인 카테고리별 비용 합계를 알 수 있다")
    @Test
    void getMainCategoryTest() {
        List<CategoryCost> values = List.of(
                new CategoryCost(MainCategoryType.FOOD_AND_TREATS, null, 300L),
                new CategoryCost(MainCategoryType.FOOD_AND_TREATS, null, 200L),
                new CategoryCost(MainCategoryType.OTHER, null, 500L),
                new CategoryCost(MainCategoryType.OTHER, null, 100L)
        );
        CategoryCosts categoryCosts = new CategoryCosts(values);

        Map<MainCategoryType, Long> mainCategoryStatics = categoryCosts.getMainCategoryCosts();

        assertAll(
                () -> assertThat(mainCategoryStatics.entrySet()).hasSize(2),
                () -> assertThat(mainCategoryStatics).containsEntry(MainCategoryType.FOOD_AND_TREATS, 500L),
                () -> assertThat(mainCategoryStatics).containsEntry(MainCategoryType.OTHER, 600L)
        );
    }

    @DisplayName("카테고리별 비용 합계를 알 수 있다")
    @Test
    void getCategoryCostsTest() {
        List<CategoryCost> values = List.of(
                new CategoryCost(MainCategoryType.FOOD_AND_TREATS, null, 300L),
                new CategoryCost(MainCategoryType.FOOD_AND_TREATS, null, 200L),
                new CategoryCost(MainCategoryType.OTHER, null, 500L),
                new CategoryCost(MainCategoryType.OTHER, null, 100L)
        );
        CategoryCosts categoryCosts = new CategoryCosts(values);

        long actual = categoryCosts.getCategoryCosts(MainCategoryType.FOOD_AND_TREATS);

        assertThat(actual).isEqualTo(500L);
    }

    @DisplayName("소분류 카테고리별 비용 합계를 알 수 있다")
    @Test
    void getSubCategoryTest() {
        List<CategoryCost> values = List.of(
                new CategoryCost(MainCategoryType.MEDICAL_EXPENSES, SubCategoryType.MEDICATION, 500L),
                new CategoryCost(MainCategoryType.MEDICAL_EXPENSES, SubCategoryType.CONSULTATION, 100L)
        );
        CategoryCosts categoryCosts = new CategoryCosts(values);

        Map<SubCategoryType, Long> mainCategoryStatics = categoryCosts.getSubCategoryCosts(MainCategoryType.MEDICAL_EXPENSES);

        assertAll(
                () -> assertThat(mainCategoryStatics.entrySet()).hasSize(2),
                () -> assertThat(mainCategoryStatics).containsEntry(SubCategoryType.MEDICATION, 500L),
                () -> assertThat(mainCategoryStatics).containsEntry(SubCategoryType.CONSULTATION, 100L)
        );
    }
}
