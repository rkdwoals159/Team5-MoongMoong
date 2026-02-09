package com.moong.dto.response.payment;

import java.util.UUID;

public record TossConfirmResponse(
        String paymentKey,
        UUID orderId,
        String status,
        long totalAmount
) {}
