package com.moong.controller.swagger;

import com.moong.annotation.swagger.ErrorCode400;
import com.moong.annotation.swagger.ErrorCode401;
import com.moong.annotation.swagger.ErrorCode404;
import com.moong.annotation.swagger.ErrorCode500;
import com.moong.domain.entity.Member;
import com.moong.dto.request.bank.BankCreateRequest;
import com.moong.dto.request.payment.CoinPaymentConfirmRequest;
import com.moong.dto.request.payment.CoinPaymentFailRequest;
import com.moong.dto.request.bank.BankUpdateRequest;
import com.moong.dto.request.bank.CoinCreateRequest;
import com.moong.dto.response.bank.BankBreakResponse;
import com.moong.dto.response.bank.BankCreateResponse;
import com.moong.dto.response.bank.BankInfoResponse;
import com.moong.dto.response.bank.BankUpdateResponse;
import com.moong.dto.response.bank.CoinCreateResponse;
import com.moong.dto.response.bank.CoinPaymentCreateResponse;
import com.moong.dto.response.bank.CoinsResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
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
    @ErrorCode400(description = """
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

    @Operation(
            summary = "저금통 정보 조회",
            description = "저금통의 현재, 목표 금액을 반환합니다"
    )
    @ApiResponse(
            responseCode = "200",
            description = "저금통 정보 조회 성공",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = BankInfoResponse.class)
            )
    )
    @ErrorCode404(description = "저금통이 아직 존재하지 않음")
    @ErrorCode500
    ResponseEntity<BankInfoResponse> findBankInfo(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member
    );

    @Operation(
            summary = "모임가계부 저금통 코인 내역 반환",
            description = "저금통의 코인 내역의 정보들의 리스트를 반환합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "저금통 코인 내역 조회 성공",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = CoinsResponse.class)
            )
    )
    @ErrorCode404(description = "저금통이 아직 존재하지 않음")
    @ErrorCode500
    ResponseEntity<CoinsResponse> findCoins(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member
    );

    @Operation(
            summary = "저금통 깨기",
            description = "저금통을 깨고, 저축 기간과 축하 메시지를 반환합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "저금통 깨기 성공",
            content = @Content(schema = @Schema(implementation = BankBreakResponse.class))
    )
    @ErrorCode401
    @ErrorCode404(description = "저금통이 아직 존재하지 않음")
    ResponseEntity<BankBreakResponse> breakBank(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member
    );

    @Operation(
            summary = "저금통 목표 금액 변경",
            description = "저금통 목표 금액을 변경하고, 변경된 금액을 반환합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "저금통 목표 금액 변경 성공",
            content = @Content(schema = @Schema(implementation = BankUpdateResponse.class))
    )
    @ErrorCode400(description = """
            - 현재 저금통에 쌓인 금액보다 낮은 금액으로 변경 시도
            - 목표 금액이 1000만원 초과
            - 목표 금액이 0원 이하
            """)
    @ErrorCode404(description = "저금통이 아직 존재하지 않음")
    @ErrorCode401
    ResponseEntity<BankUpdateResponse> updateBank(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member,
            BankUpdateRequest request
    );

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
                    content = @Content(schema = @Schema(implementation = CoinPaymentConfirmRequest.class))
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
    @ErrorCode404(description = "코인 결제 내역을 찾을 수 없음")
    @ErrorCode401
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
            summary = "결제 실패/취소 처리",
            description = "사용자가 결제를 중단하거나 프로세스 중 오류가 발생했을 때, 생성된 결제 대기 건을 실패 처리하고 락을 해제합니다."
    )
    @ApiResponse(
            responseCode = "200",
            description = "결제 실패 처리 완료"
    )
    @ErrorCode400(description = """
        - 요청 데이터(orderId, amount 등) 형식이 올바르지 않음
        - 이미 처리 완료된 결제 건에 대한 실패 요청
        """)
    @ErrorCode404(description = "해당 주문 번호(orderId)로 저장된 결제 정보를 찾을 수 없음")
    @ErrorCode401
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
