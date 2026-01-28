package com.moong.dto.response.groupexpense;

import com.moong.domain.entity.GroupExpense;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "캘린더에서 선택한 특정 날짜의 그룹 소비 내역 응답")
public record GroupExpensesDailyResponse(
        @Schema(description = "그룹원의 특정 일자 총 지출", example = "11000")
        long total,

        @ArraySchema(
                schema = @Schema(implementation = GroupExpenseDailyResponse.class),
                arraySchema = @Schema(description = "해당 날짜의 그룹 소비 내역 목록")
        )
        List<GroupExpenseDailyResponse> expenses
) {

    public GroupExpensesDailyResponse(List<GroupExpense> expenses) {
        this(
                expenses.stream()
                        .mapToLong(GroupExpense::getCost)
                        .sum(),
                expenses.stream()
                        .map(GroupExpenseDailyResponse::new)
                        .toList()
        );
    }
}
