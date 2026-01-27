package com.moong.domain.groupexpense;

import com.moong.domain.entity.GroupExpense;
import java.util.List;
import java.util.Map;
import lombok.Getter;

@Getter
public class CategoryAnalysis {

    private final long total;
    private final CategoryCosts categoryCosts;

    public CategoryAnalysis(List<GroupExpense> groupExpenses) {
        this.total = getTotalCost(groupExpenses);
        this.categoryCosts = new CategoryCosts(
                groupExpenses.stream()
                        .map(CategoryCost::new)
                        .toList()
        );
    }

    private long getTotalCost(List<GroupExpense> groupExpenses) {
        return groupExpenses.stream()
                .mapToLong(GroupExpense::getCost)
                .sum();
    }

    public Map<String, Long> getMainCategoryCosts() {
        return categoryCosts.getMainCategoryCosts();
    }
}
