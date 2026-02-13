package com.moong.dto.response.groupexpense;

import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import com.moong.domain.groupexpense.GroupExpenseDetail;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "캘린더 특정 일자 소비내역")
public record GroupExpenseDailyResponse(
        @Schema(description = "멤버 닉네임", example = "코코맘")
        String nickname,

        @Schema(description = "사용 내역", example = "감기약 및 처방약 구매")
        String usage,

        @Schema(description = "소비 금액", example = "15000")
        long cost,

        @Schema(type = "string", description = "대분류 카테고리", example = "병원비")
        MainCategoryType mainCategory,

        @Schema(type = "string", description = "대분류 카테고리", example = "약/처방")
        SubCategoryType subCategory
) {

    public GroupExpenseDailyResponse(GroupExpenseDetail expense) {
        this(
                expense.getNickName(),
                expense.getUsage(),
                expense.getCost(),
                expense.getMainCategory(),
                expense.getSubCategory()
        );
    }
}
