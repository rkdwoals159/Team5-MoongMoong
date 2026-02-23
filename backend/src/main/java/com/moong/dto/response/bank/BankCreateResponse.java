package com.moong.dto.response.bank;

import com.moong.domain.bank.Bank;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "저금통 생성 응답")
public record BankCreateResponse(
        @Schema(description = "저금통 아이디", example = "1")
        long bankId,

        @Schema(description = "저금통 목표 금액", example = "15000000")
        long target
) {
    public BankCreateResponse(Bank bank) {
        this(
                bank.getId(),
                bank.getTargetAmount()
        );
    }
}
