package com.moong.facade.payment;

import com.moong.client.payment.TossPaymentClient;
import com.moong.domain.bank.Coin;
import com.moong.domain.bank.CoinPayment;
import com.moong.domain.crew.Crew;
import com.moong.domain.member.Member;
import com.moong.domain.enums.PaymentStatus;
import com.moong.event.payment.PaymentFailedEvent;
import com.moong.dto.request.bank.CoinCreateRequest;
import com.moong.dto.request.payment.CoinPaymentConfirmRequest;
import com.moong.dto.request.payment.CoinPaymentFailRequest;
import com.moong.dto.response.bank.CoinCreateResponse;
import com.moong.dto.response.bank.CoinPaymentCreateResponse;
import com.moong.dto.response.payment.TossConfirmResponse;
import com.moong.event.payment.PaymentSuccessEvent;
import com.moong.service.bank.CoinService;
import com.moong.service.crew.CrewService;
import com.moong.service.bank.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentFacadeService {

    private final PaymentService paymentService;
    private final CrewService crewService;
    private final TossPaymentClient tossPaymentClient;
    private final ApplicationEventPublisher eventPublisher;
    private final CoinService coinService;

    public CoinPaymentCreateResponse createCoinPayment(Member member, CoinCreateRequest coinCreateRequest) {
        Crew crew = crewService.getByMemberId(member.getId());
        CoinPayment coinPayment = coinCreateRequest.toCoinPayment(crew);
        CoinPayment savedCoinOrder = paymentService.saveCoinPayment(coinPayment);

        return new CoinPaymentCreateResponse(savedCoinOrder);
    }

    public CoinCreateResponse paymentSuccess(Member member, CoinPaymentConfirmRequest request) {
        Crew crew = crewService.getFetchedByMemberId(member.getId());
        UUID orderId = request.orderId();
        long groupId = crew.getPetGroup().getId();

        Coin savedCoin = confirmAndCreateCoin(crew, request, orderId);
        PaymentSuccessEvent paymentSuccessEvent =
                new PaymentSuccessEvent(member, crew, savedCoin, groupId);
        eventPublisher.publishEvent(paymentSuccessEvent);
        return new CoinCreateResponse(savedCoin, member);
    }

    private Coin confirmAndCreateCoin(
            Crew crew,
            CoinPaymentConfirmRequest request,
            UUID orderId
    ) {
        try {
            paymentService.verifyPayment(orderId, crew.getId(), request.amount());
            TossConfirmResponse clientResponse = tossPaymentClient.confirm(request).join();
            paymentService.changePaymentStatus(orderId, crew.getId(), PaymentStatus.READY, PaymentStatus.CONFIRMED);
            return coinService.createCoin(orderId, crew, clientResponse.totalAmount());
        } catch (Exception e) {
            log.error("Failed to create coin - OrderId: {}, Error: {}", orderId, e.getMessage(), e);
            eventPublisher.publishEvent(new PaymentFailedEvent(
                    orderId,
                    crew.getId(),
                    request.paymentKey()
            ));
            throw e;
        }
    }

    public void paymentFailure(Member member, CoinPaymentFailRequest request) {
        Crew crew = crewService.getByMemberId(member.getId());
        paymentService.changePaymentStatus(request.orderId(), crew.getId(), PaymentStatus.READY, PaymentStatus.FAILED);
    }
}
