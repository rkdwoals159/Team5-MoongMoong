package com.moong.domain.groupexpense;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CategoryCosts {

    private final List<CategoryCost> values;

    public Map<String, Long> getMainCategoryCosts() {
        return values.stream()
                .collect(Collectors.groupingBy(
                                CategoryCost::getMainCategory,
                                Collectors.summingLong(CategoryCost::getCost)
                        )
                );
    }

    public Map<String, Long> getSubCategoryCosts(String mainCategory) {
        return values.stream()
                .filter(categoryCost -> categoryCost.isSameMainCategory(mainCategory))
                .collect(Collectors.groupingBy(
                                CategoryCost::getSubCategory,
                                Collectors.summingLong(CategoryCost::getCost)
                        )
                );
    }
}
