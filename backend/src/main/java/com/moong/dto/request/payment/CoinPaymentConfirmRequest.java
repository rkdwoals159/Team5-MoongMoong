package com.moong.dto.request.payment;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "결제 confirm 요청")
public record CoinPaymentConfirmRequest(
        @Schema(description = "결제 Id", example = "8973f452-cabc-4098-bdd9-d32737c86a33")
        UUID orderId,

        @Schema(description = "결제 금액", example = "10000")
        long amount,

        @Schema(description = "결제 키", example = "asdfew20260205134206Rsdd")
        String paymentKey
) {
}
