package com.moong.dto.response.memberexpense;

import com.moong.domain.entity.MemberExpense;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import org.springframework.data.domain.Pageable;

@Schema(description = "멤버 소비내역 기간 조회 응답 V2")
public record MemberExpensesPeriodResponseV2(
        @Schema(description = "조회된 소비내역 총 금액", example = "45000")
        long total,

        @Schema(description = "페이지 번호", example = "1")
        long page,

        @Schema(description = "페이지 사이즈", example = "10")
        long size,

        @Schema(description = "다음 페이지 존재 유무", example = "true")
        boolean hasNext,

        @ArraySchema(
                schema = @Schema(implementation = MemberExpenseResponse.class),
                arraySchema = @Schema(description = "조회한 소비 내역 목록")
        )
        List<MemberExpenseResponse> expenses
) {

    public MemberExpensesPeriodResponseV2(
            List<MemberExpense> sliceExpenses,
            boolean hasNext,
            Pageable requestPageable
    ) {
        this(
                sliceExpenses.stream()
                        .mapToLong(MemberExpense::getCost)
                        .sum(),
                requestPageable.getPageNumber(),
                requestPageable.getPageSize(),
                hasNext,
                sliceExpenses.stream()
                        .map(MemberExpenseResponse::new)
                        .toList()
        );
    }
}
