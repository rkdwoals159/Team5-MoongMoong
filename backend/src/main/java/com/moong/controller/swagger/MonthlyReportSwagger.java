package com.moong.controller.swagger;

import com.moong.annotation.swagger.ErrorCode401;
import com.moong.annotation.swagger.ErrorCode500;
import com.moong.domain.entity.Member;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "Report API")
public interface MonthlyReportSwagger {

    @Operation(summary = "월간 레포트 발송", description = "즉석 월간 레포트 발송")
    @ApiResponse(
            responseCode = "200",
            description = "발송 성공"
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<Void> sendThisMonthReport(@Parameter(hidden = true) Member member);
}
