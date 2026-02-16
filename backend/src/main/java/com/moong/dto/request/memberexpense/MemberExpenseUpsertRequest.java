package com.moong.dto.request.memberexpense;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDate;

public record MemberExpenseUpsertRequest(
        @Schema(
                description = "신규 생성 여부 (true: 새 소비내역 생성, false: 기존 소비내역 수정)",
                example = "true"
        )
        boolean isNew,

        @Schema(description = "소비내역 ID", example = "1")
        Long expenseId,

        @Schema(description = "소비 날짜", example = "2026-01-20")
        @NotNull(message = "멤버 소비내역 갱신 - 소비날짜는 null일 수 없습니다")
        LocalDate spentAt,

        @Schema(description = "사용 내역", example = "감기약 및 처방약 구매")
        @NotNull(message = "멤버 소비내역 갱신 - 사용 내역은 null일 수 없습니다")
        String usage,

        @Schema(description = "소비 금액", example = "15000")
        @PositiveOrZero(message = "멤버 소비내역 갱신 - 사용금액은 0이상 혹은 양수여야 합니다")
        long cost,

        @Schema(type = "string", description = "대분류 카테고리", example = "병원비")
        @NotNull(message = "멤버 소비내역 갱신 - 대분류는 null일 수 없습니다.")
        MainCategoryType mainCategory,

        @Schema(type = "string", description = "소분류 카테고리", example = "약/처방")
        @Nullable
        SubCategoryType subCategory,

        @Schema(description = "메모", example = "정기 구매")
        @Nullable
        String memo
) {

    public MemberExpense toMemberExpense(Member member) {
        return new MemberExpense(
                expenseId,
                this.spentAt(),
                this.usage(),
                this.cost(),
                this.mainCategory,
                this.subCategory,
                this.memo,
                null,
                member
        );
    }
}
