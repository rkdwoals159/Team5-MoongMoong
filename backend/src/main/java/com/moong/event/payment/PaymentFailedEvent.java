package com.moong.event.payment;

import java.util.UUID;

public record PaymentFailedEvent(
        UUID orderId,
        long crewId,
        String paymentKey
) {

}
