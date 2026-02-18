package com.moong.dto.response.bank;

public record BankWithBankBreakResponse(
        long bankId,
        BankBreakResponse bankBreakResponse
) {
}
