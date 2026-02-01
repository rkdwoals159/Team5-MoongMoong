package com.moong.dto.request.bank;

import com.moong.domain.entity.Bank;
import com.moong.domain.entity.Coin;
import com.moong.domain.entity.Crew;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "저금하기 요청")
public record CoinCreateRequest(
        @Schema(description = "저금 금액", example = "5000")
        long amount
) {
    public Coin toCoin(Bank bank, Crew crew) {
        return new Coin(null, bank, crew, amount);
    }
}
