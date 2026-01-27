package com.moong.domain.groupexpense;

import com.moong.domain.entity.GroupExpense;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CategoryCost {

    private final String mainCategory;
    private final String subCategory;
    private final long cost;

    public CategoryCost(GroupExpense groupExpense) {
        this(groupExpense.getMainCategory(), groupExpense.getSubCategory(), groupExpense.getCost());
    }

    public boolean isSameMainCategory(String mainCategory) {
        return this.mainCategory.equals(mainCategory);
    }
}
