package com.moong.dto.request.payment;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(description = "결제 신청 실패 시 요청")
public record CoinPaymentFailRequest(
        @Schema(description = "토스 결제 에러 코드", example = "ALREADY_PROCESSED_PAYMENT")
        @NotBlank(message = "결제 신청 실패 시 요청 - code는 빈 값일 수 없습니다")
        String code,

        @Schema(description = "토스 에러 메세지", example = "이미 처리된 결제 입니다.")
        @NotBlank(message = "결제 신청 실패 시 요청 - 토스 에러 메시지는 빈 값일 수 없습니다")
        String message,

        @Schema(description = "결제 Id", example = "8973f452-cabc-4098-bdd9-d32737c86a33")
        @NotNull(message = "결제 신청 실패 시 요청 - orderId는 빈 값일 수 없습니다")
        UUID orderId
) {
}
