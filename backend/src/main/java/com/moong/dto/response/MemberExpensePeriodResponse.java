package com.moong.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;


@Schema(description = "멤버 소비내역 기간 조회 응답")
public record MemberExpensePeriodResponse(
        @Schema(description = "조회된 소비내역 총 금액", example = "45000")
        int total,

        @Schema(description = "소비내역 목록")
        List<ExpenseResponse> expenses
) {}

