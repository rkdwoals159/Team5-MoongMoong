package com.moong.controller.swagger;

import com.moong.annotation.swagger.ErrorCode400;
import com.moong.dto.response.MemberExpensePeriodResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;

@Tag(name = "MemberExpense API")
public interface MemberExpenseControllerSwagger {

    @Operation(summary = "기간 내의 개인 소비내역 반환",
            description = "시작일/종료일을 기준으로 기간 내 개인 소비내역을 최신순으로 조회합니다.",
            parameters = {
                    @Parameter(
                            name = "memberId",
                            description = "회원 ID",
                            example = "1",
                            required = true
                    ),
                    @Parameter(
                            name = "startDate",
                            description = "조회 시작일 (yyyy-MM-dd)",
                            example = "2026-01-01",
                            required = true
                    ),
                    @Parameter(
                            name = "endDate",
                            description = "조회 종료일 (yyyy-MM-dd)",
                            example = "2026-01-31",
                            required = true
                    )
            },
            responses = {
            @ApiResponse(
                    responseCode = "200",
                    description = "개인 소비 내역 반환 성공",
                    content = @Content(schema = @Schema(implementation = MemberExpensePeriodResponse.class))
            ),

    })
    @ErrorCode400(description = "시작일은 종료일보다 늦을 수 없습니다.")
    ResponseEntity<MemberExpensePeriodResponse> getMemberExpensesByPeriod(
            long memberId,
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate
    );
}
