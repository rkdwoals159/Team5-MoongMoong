package com.moong.dto.response.payment;

public record TossCancelResponse(
        String status,
        String lastTransactionKey
) {
}
