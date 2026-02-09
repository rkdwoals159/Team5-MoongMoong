package com.moong.dto;

import java.util.UUID;

public record PaymentFailedEvent(
        UUID orderId,
        long crewId,
        String paymentKey
) {

}
