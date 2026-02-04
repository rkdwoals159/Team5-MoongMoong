package com.moong.controller.swagger;

import com.moong.annotation.auth.AuthMember;
import com.moong.annotation.swagger.ErrorCode400;
import com.moong.annotation.swagger.ErrorCode401;
import com.moong.annotation.swagger.ErrorCode500;
import com.moong.domain.entity.Member;
import com.moong.dto.request.memberexpense.CategorizeRequest;
import com.moong.dto.request.memberexpense.MemberExpensesUpsertRequest;
import com.moong.dto.response.categorize.CategorizeResponse;
import com.moong.dto.response.memberexpense.LastMonthComparisonResponse;
import com.moong.dto.response.memberexpense.MemberExpensesUpsertResponse;
import com.moong.dto.response.memberexpense.MemberExpensesPeriodResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;

@Tag(name = "MemberExpense API")
public interface MemberExpenseControllerSwagger {

    @Operation(summary = "기간 내의 개인 소비내역 반환",
            description = "시작일/종료일을 기준으로 기간 내 개인 소비내역을 최신순으로 조회합니다.",
            parameters = {
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
                            content = @Content(schema = @Schema(implementation = MemberExpensesPeriodResponse.class))
                    ),

            })
    @ErrorCode400(description = "시작일은 종료일보다 늦을 수 없습니다.")
    ResponseEntity<MemberExpensesPeriodResponse> getMemberExpensesByPeriod(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate
    );

    @Operation(summary = "지난달 소비 내역 통계",
            description = "지난달 소비내역과 의료비 소비내역 통계를 반환합니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "지난달 소비 내역 통계 반환 성공",
                            content = @Content(schema = @Schema(implementation = LastMonthComparisonResponse.class))
                    ),

            })
    ResponseEntity<LastMonthComparisonResponse> compareLastMonthExpense(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member
    );

    @Operation(summary = "개인 소비 지출 입력",
            description = "개인 소비 내역을 생성하거나 수정하고, 삭제 대상 내역은 함께 제거합니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "생성, 수정, 삭제 성공",
                            content = @Content(schema = @Schema(implementation = MemberExpensesUpsertResponse.class))
                    )
            }
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<MemberExpensesUpsertResponse> upsertMemberExpenses(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,
            @RequestBody(
                    description = "수정, 추가, 삭제된 소비 내역들",
                    content = @Content(schema = @Schema(implementation = MemberExpensesUpsertRequest.class))
            )
            MemberExpensesUpsertRequest request
    );

    @Operation(summary = "자동 카테고리 분류",
            description = "유저의 사용내역을 보고 대분류/소분류 카테고리를 자동 분류합니다",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "카테고리 분류 성공",
                            content = @Content(schema = @Schema(implementation = CategorizeResponse.class))
                    )
            }
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<CategorizeResponse> categorizeMemberExpenses(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,
            @RequestBody(
                    description = "자동카테고리 분류 요청",
                    content = @Content(schema = @Schema(implementation = CategorizeRequest.class))
            )
            CategorizeRequest request
    );
}
