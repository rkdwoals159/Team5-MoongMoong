package com.moong.dto.response.bank;

import com.moong.domain.entity.CoinPayment;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "결제 신청 전 금액 저장 및 결제 Id 생성 요청")
public record CoinPaymentCreateResponse(
        @Schema(description = "결제 Id", example = "8973f452-cabc-4098-bdd9-d32737c86a33")
        UUID orderId,

        @Schema(description = "결제 금액", example = "1000")
        long amount
) {

    public CoinPaymentCreateResponse(CoinPayment coinPayment) {
        this(coinPayment.getId(), coinPayment.getAmount());
    }
}
