package com.moong.dto.request.bank;

import com.moong.domain.entity.CoinPayment;
import com.moong.domain.entity.Crew;
import com.moong.domain.enums.PaymentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Positive;

@Schema(description = "저금하기 요청")
public record CoinCreateRequest(
        @Schema(description = "저금 금액", example = "5000")
        @Positive(message = "저금 금액은 음수일 수 없습니다")
        long amount
) {

    public CoinPayment toCoinPayment(Crew crew) {
        return new CoinPayment(null, amount, crew, PaymentStatus.READY);
    }
}
