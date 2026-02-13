package com.moong.domain.groupexpense;

import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CategoryCosts {

    private final List<CategoryCost> values;

    public long getCategoryCosts(MainCategoryType mainCategory) {
        return values.stream()
                .filter(categoryCost -> categoryCost.isSameMainCategory(mainCategory))
                .mapToLong(CategoryCost::getCost)
                .sum();
    }

    public Map<MainCategoryType, Long> getMainCategoryCosts() {
        return values.stream()
                .collect(Collectors.groupingBy(
                                CategoryCost::getMainCategory,
                                Collectors.summingLong(CategoryCost::getCost)
                        )
                );
    }

    public Map<SubCategoryType, Long> getSubCategoryCosts(MainCategoryType mainCategory) {
        return values.stream()
                .filter(categoryCost -> categoryCost.isSameMainCategory(mainCategory))
                .collect(Collectors.groupingBy(
                                CategoryCost::getSubCategory,
                                Collectors.summingLong(CategoryCost::getCost)
                        )
                );
    }
}
