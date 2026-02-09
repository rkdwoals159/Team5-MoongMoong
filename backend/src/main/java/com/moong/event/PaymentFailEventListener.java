package com.moong.event;

import com.moong.client.payment.TossPaymentClient;
import com.moong.domain.entity.CoinPayment;
import com.moong.domain.enums.PaymentStatus;
import com.moong.dto.PaymentFailedEvent;
import com.moong.dto.request.payment.TossCancelRequest;
import com.moong.repository.CoinPaymentRepository;
import com.moong.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentFailEventListener {

    private final CoinPaymentRepository coinPaymentRepository;
    private final PaymentService paymentService;
    private final TossPaymentClient tossPaymentClient;

    @Async
    @EventListener
    public void handlePaymentFailed(PaymentFailedEvent event) {
        CoinPayment coinPayment = coinPaymentRepository.getByIdAndCrewId(event.orderId(), event.crewId());
        if (coinPayment.isConfirm()) {
            try {
                tossPaymentClient.cancel(event.paymentKey(), TossCancelRequest.forInternalError()).join();
            } catch (Exception e) {
                log.error("Failed to cancel coin payment - Error: {}", e.getMessage(), e);
            }
        }
        paymentService.changePaymentStatus(
                event.orderId(),
                event.crewId(),
                coinPayment.getPaymentStatus(),
                PaymentStatus.FAILED
        );
    }
}
