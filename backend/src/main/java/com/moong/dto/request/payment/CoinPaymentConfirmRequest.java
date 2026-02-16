package com.moong.dto.request.payment;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.UUID;

@Schema(description = "결제 confirm 요청")
public record CoinPaymentConfirmRequest(
        @Schema(description = "결제 Id", example = "8973f452-cabc-4098-bdd9-d32737c86a33")
        @NotNull(message = "결제 confirm 요청 - 결제 Id는 null일 수 없습니다")
        UUID orderId,

        @Schema(description = "결제 금액", example = "10000")
        @Positive(message = "결제 confirm 요청 - 결제 요청 금액은 음수일 수 없습니다")
        long amount,

        @Schema(description = "결제 키", example = "asdfew20260205134206Rsdd")
        @NotBlank(message = "결제 confirm 요청 - 결제 키는 빈 값일 수 없습니다")
        String paymentKey
) {

}
