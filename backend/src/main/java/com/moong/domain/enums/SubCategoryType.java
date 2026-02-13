package com.moong.domain.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Arrays;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SubCategoryType {

    CONSULTATION("진료비"),
    VACCINATION("예방접종"),
    MEDICATION("약/처방"),
    EXAMINATION("검사비"),
    SURGERY_HOSPITALIZATION("수술/입원"),
    OTHER_MEDICAL("기타 의료비");

    private final String description;

    public static SubCategoryType fromDescription(String subCategory) {
        if (subCategory == null) return null;

        return Arrays.stream(SubCategoryType.values())
                .filter(type -> type.description.equals(subCategory))
                .findAny()
                .orElse(null);
    }
}
