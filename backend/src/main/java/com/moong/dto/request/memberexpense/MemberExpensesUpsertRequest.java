package com.moong.dto.request.memberexpense;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import java.util.List;

public record MemberExpensesUpsertRequest(
        @Valid
        @ArraySchema(
                schema = @Schema(implementation = MemberExpenseUpsertRequest.class),
                arraySchema = @Schema(description = "생성 및 수정할 소비내역 목록")
        )
        List<MemberExpenseUpsertRequest> expenses,

        @ArraySchema(
                schema = @Schema(implementation = Long.class),
                arraySchema = @Schema(description = "삭제할 소비내역 ID 목록")
        )
        List<Long> deletedIds
) {
    public List<MemberExpense> getExpensesToCreate(Member member) {
        return expenses()
                .stream()
                .filter(MemberExpenseUpsertRequest::isNew)
                .map(dto -> dto.toMemberExpense(member))
                .toList();
    }

    public List<MemberExpense> getExpensesToUpdate(Member member) {
        return expenses()
                .stream()
                .filter(dto -> !dto.isNew())
                .map(dto -> dto.toMemberExpense(member))
                .toList();
    }
}
