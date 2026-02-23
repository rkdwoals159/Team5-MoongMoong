package com.moong.event.payment;

import com.moong.client.payment.TossPaymentClient;
import com.moong.domain.bank.CoinPayment;
import com.moong.domain.enums.PaymentStatus;
import com.moong.dto.request.payment.TossCancelRequest;
import com.moong.repository.bank.CoinPaymentRepository;
import com.moong.service.bank.PaymentService;
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

    @Async("paymentEventExecutor")
    @EventListener
    public void handlePaymentFailed(PaymentFailedEvent event) {
        CoinPayment coinPayment = coinPaymentRepository.getByIdAndCrewId(event.orderId(), event.crewId());
        PaymentStatus status = coinPayment.getPaymentStatus();

        if (coinPayment.hasStatus(PaymentStatus.CONFIRMED)) {
            cancelPaymentOnFailure(event);
        }

        paymentService.changePaymentStatus(
                event.orderId(),
                event.crewId(),
                status,
                PaymentStatus.FAILED
        );
    }

    private void cancelPaymentOnFailure(PaymentFailedEvent event) {
        try {
            tossPaymentClient.cancel(event.paymentKey(), TossCancelRequest.forInternalError()).join();
        } catch (Exception e) {
            log.error("Failed to cancel coin payment - Error: {}", e.getMessage(), e);
        }
    }
}
