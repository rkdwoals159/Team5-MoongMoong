package com.moong.controller.swagger;

import com.moong.annotation.swagger.ErrorCode400;
import com.moong.annotation.swagger.ErrorCode401;
import com.moong.annotation.swagger.ErrorCode500;
import com.moong.domain.entity.Member;
import com.moong.dto.request.bank.BankCreateRequest;
import com.moong.dto.response.bank.BankCreateResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "GroupBank API")
public interface BankControllerSwagger {

    @Operation(
            summary = "저금통 생성",
            description = """
                         로그인한 사용자가 속한 모임에
                         목표 금액을 가진 저금통을 생성합니다.
                         """
    )
    @ApiResponse(
            responseCode = "200",
            description = "저금통 생성 성공",
            content = @Content(
                    schema = @Schema(implementation = BankCreateResponse.class))
    )
    @ErrorCode400( description = """
        저금통이 이미 존재하는 경우 저금통 생성에 실패합니다.
        """
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<BankCreateResponse> createBank(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,
            BankCreateRequest request
    );
}
