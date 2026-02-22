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
            summary = "재촉하기",
            description = """
                    같은 그룹원들에게 저금하기를 재촉합니다.
                    """
    )
    @ApiResponse(
            responseCode = "200",
            description = "재촉하기 성공"
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<Void> createGroupNudge(
            @Parameter(description = "인증된 사용자 정보 (Access Token 기반)", hidden = true)
            Member member
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
}
