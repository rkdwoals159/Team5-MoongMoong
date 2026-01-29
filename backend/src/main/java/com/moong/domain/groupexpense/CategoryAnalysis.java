package com.moong.domain.groupexpense;

import com.moong.domain.entity.GroupExpense;
import com.moong.domain.entity.MemberExpense;
import java.util.List;
import java.util.Map;
import lombok.Getter;

@Getter
public class CategoryAnalysis {

    private final long total;
    private final CategoryCosts categoryCosts;

    public CategoryAnalysis(List<GroupExpenseDetail> expenses) {
        this.total = getTotalCost(expenses);
        this.categoryCosts = new CategoryCosts(
                expenses.stream()
                        .map(CategoryCost::new)
                        .toList()
        );
    }

    public long getCategoryTotalCosts(String mainCategory) {
        return categoryCosts.getCategoryCosts(mainCategory);
    }

    private long getTotalCost(List<GroupExpenseDetail> expenses) {
        return expenses.stream()
                .mapToLong(GroupExpenseDetail::getCost)
                .sum();
    }

    public Map<String, Long> getMainCategoryCosts() {
        return categoryCosts.getMainCategoryCosts();
    }

    public Map<String, Long> getSubCategoryCosts(String mainCategory) {
        return categoryCosts.getSubCategoryCosts(mainCategory);
    }
}
