package com.moong.dto.response.memberexpense;

import com.moong.domain.entity.MemberExpense;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;


@Schema(description = "멤버 소비내역 기간 조회 응답")
public record MemberExpensesPeriodResponse(
        @Schema(description = "조회된 소비내역 총 금액", example = "45000")
        long total,

        @ArraySchema(
                schema = @Schema(implementation = MemberExpenseResponse.class),
                arraySchema = @Schema(description = "조회한 소비 내역 목록")
        )
        List<MemberExpenseResponse> expenses
) {
    public MemberExpensesPeriodResponse(List<MemberExpense> expenses) {
        this(
                expenses.stream()
                        .mapToLong(MemberExpense::getCost)
                        .sum(),
                expenses.stream()
                        .map(MemberExpenseResponse::new)
                        .toList()
        );
    }
}

