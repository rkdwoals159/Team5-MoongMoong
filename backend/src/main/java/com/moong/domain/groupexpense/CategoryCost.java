package com.moong.domain.groupexpense;

import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CategoryCost {

    private final MainCategoryType mainCategory;
    private final SubCategoryType subCategory;
    private final long cost;

    public CategoryCost(GroupExpenseDetail expense) {
        this(expense.getMainCategory(), expense.getSubCategory(), expense.getCost());
    }

    public boolean isSameMainCategory(MainCategoryType mainCategory) {
        return this.mainCategory.equals(mainCategory);
    }
}
