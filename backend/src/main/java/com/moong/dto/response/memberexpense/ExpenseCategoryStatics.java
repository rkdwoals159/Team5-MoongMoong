package com.moong.dto.response.memberexpense;

import com.moong.domain.enums.MainCategoryType;

public record ExpenseCategoryStatics(
        MainCategoryType mainCategory,
        long amount
) {

}
