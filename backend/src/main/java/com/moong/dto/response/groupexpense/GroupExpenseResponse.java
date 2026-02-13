package com.moong.dto.response.groupexpense;

import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import com.moong.domain.groupexpense.GroupExpenseDetail;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record GroupExpenseResponse(

        @Schema(description = "소비 내역 ID", example = "1")
        long expenseId,

        @Schema(description = "소비 날짜", example = "2026-01-20")
        LocalDate spendAt,

        @Schema(description = "사용자 닉네임", example = "코코맘")
        String nickName,

        @Schema(description = "사용 내역", example = "감기약 및 처방약 구매")
        String usage,

        @Schema(description = "소비 금액", example = "18500")
        long cost,

        @Schema(type = "string", description = "대분류 카테고리", example = "병원비")
        MainCategoryType mainCategory,

        @Schema(type = "string", description = "소분류 카테고리", example = "약/처방", nullable = true)
        SubCategoryType subCategory,

        @Schema(description = "메모 (입력하지 않은 경우 null)", example = "내과 진료 후 약국", nullable = true)
        String memo,

        @Schema(description = "수정 일시 (ISO-8601, 타임존 포함)", example = "2026-01-20T14:32:15.123+09:00")
        LocalDateTime modifiedAt
) {
    public GroupExpenseResponse(GroupExpenseDetail expense) {
        this(
                expense.getMemberExpenseId(),
                expense.getSpentAt(),
                expense.getNickName(),
                expense.getUsage(),
                expense.getCost(),
                expense.getMainCategory(),
                expense.getSubCategory(),
                expense.getMemo(),
                expense.getModifiedAt()
        );
    }

}

