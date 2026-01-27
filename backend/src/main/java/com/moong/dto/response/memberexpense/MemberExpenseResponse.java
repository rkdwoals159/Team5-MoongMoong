package com.moong.dto.response.memberexpense;

import com.moong.domain.entity.MemberExpense;
import java.time.LocalDate;
import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "소비내역 단건 응답 DTO")
public record MemberExpenseResponse(

        @Schema(description = "소비내역 ID", example = "1")
        long expenseId,

        @Schema(description = "소비 날짜", example = "2026-01-20")
        LocalDate spentAt,

        @Schema(description = "사용 내역", example = "감기약 및 처방약 구매")
        String usage,

        @Schema(description = "소비 금액", example = "15000")
        long cost,

        @Schema(description = "대분류 카테고리", example = "병원비")
        String mainCategory,

        @Schema(description = "소분류 카테고리", example = "약/처방")
        String subCategory,

        @Schema(description = "메모", example = "정기 구매")
        String memo,

        @Schema(description = "수정일자", example = "2026-01-20T14:32:15.123+09:00")
        LocalDateTime modifiedAt
) {

    public MemberExpenseResponse(MemberExpense memberExpense) {
        this(
                memberExpense.getId(),
                memberExpense.getSpentAt(),
                memberExpense.getUsage(),
                memberExpense.getCost(),
                memberExpense.getMainCategory(),
                memberExpense.getSubCategory(),
                memberExpense.getMemo(),
                memberExpense.getModifiedAt()
        );
    }

}

