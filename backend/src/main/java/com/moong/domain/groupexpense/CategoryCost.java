package com.moong.domain.groupexpense;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CategoryCost {

    private final String mainCategory;
    private final String subCategory;
    private final long cost;

    public CategoryCost(GroupExpenseDetail expense) {
        this(expense.getMainCategory(), expense.getSubCategory(), expense.getCost());
    }

    public boolean isSameMainCategory(String mainCategory) {
        return this.mainCategory.equals(mainCategory);
    }
}
