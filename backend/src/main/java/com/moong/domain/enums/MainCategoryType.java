package com.moong.domain.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Arrays;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MainCategoryType {

    FOOD_AND_TREATS("사료/간식"),
    MEDICAL_EXPENSES("의료비"),
    SUPPLIES("물품구매비"),
    GROOMING("미용"),
    OTHER("기타");

    private final String description;

    public static MainCategoryType fromDescription(String mainCategory) {
        if (mainCategory == null) return MainCategoryType.OTHER;

        return Arrays.stream(MainCategoryType.values())
                .filter(type -> type.description.equals(mainCategory))
                .findAny()
                .orElse(MainCategoryType.OTHER);
    }
}
