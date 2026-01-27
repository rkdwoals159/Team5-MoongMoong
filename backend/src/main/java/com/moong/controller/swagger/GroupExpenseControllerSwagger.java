package com.moong.controller.swagger;

import com.moong.annotation.swagger.ErrorCode401;
import com.moong.annotation.swagger.ErrorCode500;
import com.moong.domain.entity.Member;
import com.moong.dto.response.groupexpense.CategoryAnalysisResponse;
import com.moong.dto.response.groupexpense.GroupExpensesResponse;
import com.moong.dto.response.groupexpense.MedicalCategoryAnalysisResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.time.LocalDate;
import org.springframework.http.ResponseEntity;

public interface GroupExpenseControllerSwagger {

    @Operation(
            summary = "모임 소비 내역 조회",
            description = """
                    로그인한 사용자가 속한 모임의 소비 내역을
                    지정한 기간(startDate ~ endDate) 기준으로 조회합니다.
                    spendAt 기준 내림차순 > modifiedAt 기준 내림차순 정렬됩니다.
                    """
    )
    @ApiResponse(
            responseCode = "200",
            description = "모임 소비 내역 조회 성공",
            content = @Content(schema = @Schema(implementation = GroupExpensesResponse.class)
            )
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<GroupExpensesResponse> findGroupExpenses(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,

            @Parameter(description = "조회 시작 날짜", example = "2026-01-01", required = true)
            LocalDate startDate,

            @Parameter(description = "조회 종료 날짜", example = "2026-01-31", required = true)
            LocalDate endDate
    );

    @Operation(
            summary = "모임 소비 내역 카테고리 분석결과 조회",
            description = """
                    로그인한 사용자가 속한 모임의 소비 내역을
                    지정한 기간(startDate ~ endDate) 기준으로 조회합니다.
                    소비내역이 가장 많은 카테고리별 순으로 내림차순 정렬됩니다.
                    """
    )
    @ApiResponse(
            responseCode = "200",
            description = "카테고리별 소비 분석 내역 조회 성공",
            content = @Content(schema = @Schema(implementation = CategoryAnalysisResponse.class)
            )
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<CategoryAnalysisResponse> findCategoryAnalysis(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,

            @Parameter(description = "조회 시작 날짜", example = "2026-01-01", required = true)
            LocalDate startDate,

            @Parameter(description = "조회 종료 날짜", example = "2026-01-31", required = true)
            LocalDate endDate
    );

    @Operation(
            summary = "모임 소비 내역 의료비 소분류 분석결과 조회",
            description = """
                    로그인한 사용자가 속한 모임의 의료비 소분류별 내역을
                    지정한 기간(startDate ~ endDate) 기준으로 조회합니다.
                    소비내역이 가장 많은 카테고리별 순으로 내림차순 정렬됩니다.
                    """
    )
    @ApiResponse(
            responseCode = "200",
            description = "의료비 분석 내역 조회 성공",
            content = @Content(schema = @Schema(implementation = MedicalCategoryAnalysisResponse.class)
            )
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<MedicalCategoryAnalysisResponse> findMedicalCategoryAnalysis(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,

            @Parameter(description = "조회 시작 날짜", example = "2026-01-01", required = true)
            LocalDate startDate,

            @Parameter(description = "조회 종료 날짜", example = "2026-01-31", required = true)
            LocalDate endDate
    );
}
