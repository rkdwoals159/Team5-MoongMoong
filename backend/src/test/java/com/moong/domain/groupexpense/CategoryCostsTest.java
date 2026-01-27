package com.moong.domain.groupexpense;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CategoryCostsTest {


    @DisplayName("메인 카테고리별 비용 합계를 알 수 있다")
    @Test
    void getMainCategoryTest() {
        List<CategoryCost> values = List.of(
                new CategoryCost("식비", "카페", 300L),
                new CategoryCost("식비", "카페", 200L),
                new CategoryCost("생활비", "월세", 500L),
                new CategoryCost("생활비", "칫솔", 100L)
        );
        CategoryCosts categoryCosts = new CategoryCosts(values);

        Map<String, Long> mainCategoryStatics = categoryCosts.getMainCategoryCosts();

        assertAll(
                () -> assertThat(mainCategoryStatics.entrySet()).hasSize(2),
                () -> assertThat(mainCategoryStatics).containsEntry("식비", 500L),
                () -> assertThat(mainCategoryStatics).containsEntry("생활비", 600L)
        );
    }

    @DisplayName("카테고리별 비용 합계를 알 수 있다")
    @Test
    void getCategoryCostsTest() {
        List<CategoryCost> values = List.of(
                new CategoryCost("식비", "카페", 300L),
                new CategoryCost("식비", "카페", 200L),
                new CategoryCost("생활비", "월세", 500L),
                new CategoryCost("생활비", "칫솔", 100L)
        );
        CategoryCosts categoryCosts = new CategoryCosts(values);

        long actual = categoryCosts.getCategoryCosts("식비");

        assertThat(actual).isEqualTo(500L);
    }

    @DisplayName("소분류 카테고리별 비용 합계를 알 수 있다")
    @Test
    void getSubCategoryTest() {
        List<CategoryCost> values = List.of(
                new CategoryCost("생활비", "월세", 500L),
                new CategoryCost("생활비", "칫솔", 100L)
        );
        CategoryCosts categoryCosts = new CategoryCosts(values);

        Map<String, Long> mainCategoryStatics = categoryCosts.getSubCategoryCosts("생활비");

        assertAll(
                () -> assertThat(mainCategoryStatics.entrySet()).hasSize(2),
                () -> assertThat(mainCategoryStatics).containsEntry("월세", 500L),
                () -> assertThat(mainCategoryStatics).containsEntry("칫솔", 100L)
        );
    }
}
