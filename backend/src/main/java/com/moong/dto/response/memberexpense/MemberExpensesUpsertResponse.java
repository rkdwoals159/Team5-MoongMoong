package com.moong.dto.response.memberexpense;

import com.moong.domain.entity.MemberExpense;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public record MemberExpensesUpsertResponse(
    @ArraySchema(
            schema = @Schema(implementation = MemberExpenseResponse.class),
            arraySchema = @Schema(description = "생성, 수정된 소비 내역 목록")
    )
    List<MemberExpenseResponse> expenses
) {

    public static MemberExpensesUpsertResponse from(List<MemberExpense> expenses) {
        List<MemberExpenseResponse> list = expenses.stream()
                .map(MemberExpenseResponse::new)
                .toList();
        return new MemberExpensesUpsertResponse(list);
    }
}
