package com.moong.controller.swagger;

import com.moong.annotation.swagger.ErrorCode400;
import com.moong.annotation.swagger.ErrorCode401;
import com.moong.annotation.swagger.ErrorCode404;
import com.moong.domain.member.Member;
import com.moong.dto.request.bank.CoinCreateRequest;
import com.moong.dto.request.payment.CoinPaymentConfirmRequest;
import com.moong.dto.request.payment.CoinPaymentFailRequest;
import com.moong.dto.response.bank.CoinCreateResponse;
import com.moong.dto.response.bank.CoinPaymentCreateResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;

public interface PaymentControllerSwagger {

    @Operation(
            summary = "결제 요청 전 정보 등록 및 검증",
            description = "실제 결제 요청 전, 요청 금액의 유효성을 검증하고 고유 주문 번호(OrderId)를 생성하여 전달합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "실제 결제 전 금액 요청 성공",
            content = @Content(schema = @Schema(implementation = CoinPaymentCreateResponse.class))
    )
    @ErrorCode400(description = """
            - 저금하기 금액이 0원 이하
            - 이미 저금통 목표 금액 도달
            """)
    @ErrorCode401
    @ErrorCode404(description = "저금통이 아직 존재하지 않음")
    ResponseEntity<CoinPaymentCreateResponse> createCoinPayment(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,
            @RequestBody(
                    description = "결제 요청 전 검증을 위한 금액 데이터 저장 요청",
                    content = @Content(schema = @Schema(implementation = CoinCreateRequest.class))
            )
            CoinCreateRequest request
    );

    @Operation(
            summary = "결제 성공 시 결제 확정을 위한 요청",
            description = "결제 성공 시 결제 확정을 위해 서버에 요청합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "결제 확정을 성공하여 저금에 성공합니다.",
            content = @Content(schema = @Schema(implementation = CoinCreateResponse.class))
    )
    @ErrorCode400(description = """
            - 유효하지 않은 결제 요청
            - 결제 확정 금액이 주문 금액과 일치하지 않는 경우
            - 이미 처리 중이거나 완료된 결제 요청
            """)
    @ErrorCode401
    @ErrorCode404(description = "코인 결제 내역을 찾을 수 없음")
    ResponseEntity<CoinCreateResponse> paymentSuccess(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,
            @RequestBody(
                    description = "결제 성공 시 요청 데이터",
                    content = @Content(schema = @Schema(implementation = CoinPaymentConfirmRequest.class))
            )
            CoinPaymentConfirmRequest request
    );

    @Operation(
            summary = "결제 실패 처리",
            description = "사용자가 결제를 중단하거나 프로세스 중 오류가 발생했을 때, 생성된 결제 대기 건을 실패 처리하고 락을 해제합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "결제 실패 처리 완료"
    )
    @ErrorCode400(description = """
        - 요청 데이터(orderId, amount 등) 형식이 올바르지 않음
        """)
    @ErrorCode401
    @ErrorCode404(description = "해당 주문 번호(orderId)로 저장된 결제 정보를 찾을 수 없음")
    ResponseEntity<Void> paymentFailure(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,
            @RequestBody(
                    description = "결제 실패 시 요청 데이터",
                    content = @Content(schema = @Schema(implementation = CoinPaymentFailRequest.class))
            )
            CoinPaymentFailRequest request
    );
}
