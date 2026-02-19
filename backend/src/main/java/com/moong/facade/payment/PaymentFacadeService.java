package com.moong.facade.payment;

import com.moong.client.payment.TossPaymentClient;
import com.moong.domain.entity.Coin;
import com.moong.domain.entity.CoinPayment;
import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.enums.PaymentStatus;
import com.moong.dto.PaymentFailedEvent;
import com.moong.dto.request.bank.CoinCreateRequest;
import com.moong.dto.request.payment.CoinPaymentConfirmRequest;
import com.moong.dto.request.payment.CoinPaymentFailRequest;
import com.moong.dto.response.bank.CoinCreateResponse;
import com.moong.dto.response.bank.CoinPaymentCreateResponse;
import com.moong.dto.response.payment.TossConfirmResponse;
import com.moong.event.dto.CoinCreatedPayload;
import com.moong.event.dto.GroupEventMessage;
import com.moong.event.transport.GroupEventChannelSender;
import com.moong.service.BankService;
import com.moong.service.CrewService;
import com.moong.service.PaymentService;
import com.moong.service.RankingService;
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
    private final BankService bankService;
    private final RankingService rankingService;
    private final TossPaymentClient tossPaymentClient;
    private final ApplicationEventPublisher eventPublisher;
    private final GroupEventChannelSender groupEventChannelSender;

    public CoinPaymentCreateResponse createCoinPayment(Member member, CoinCreateRequest coinCreateRequest) {
        Crew crew = crewService.getByMemberId(member.getId());
        CoinPayment coinPayment = coinCreateRequest.toCoinPayment(crew);
        CoinPayment savedCoinOrder = paymentService.saveCoinPayment(coinPayment);

        return new CoinPaymentCreateResponse(savedCoinOrder);
    }

    public CoinCreateResponse paymentSuccess(Member member, CoinPaymentConfirmRequest request) {
        Crew crew = crewService.getFetchedByMemberId(member.getId());
        UUID orderId = request.orderId();
        long crewId = crew.getId();
        long groupId = crew.getPetGroup().getId();

        try {
            paymentService.verifyPayment(orderId, crewId, request.amount());
            TossConfirmResponse clientResponse = tossPaymentClient.confirm(request).join();

            paymentService.changePaymentStatus(orderId, crewId, PaymentStatus.READY, PaymentStatus.CONFIRMED);

            Coin savedCoin = bankService.createCoin(member, crew, clientResponse.totalAmount());

            paymentService.changePaymentStatus(orderId, crewId, PaymentStatus.CONFIRMED, PaymentStatus.COIN_CREATED);

            GroupEventMessage<CoinCreatedPayload> savingMessage =
                    GroupEventMessage.saving(member, groupId, savedCoin);

            groupEventChannelSender.sendAsync(savingMessage);
            rankingService.updateRanking(member, savedCoin.getAmount());

            paymentService.changePaymentStatus(orderId, crewId, PaymentStatus.COIN_CREATED, PaymentStatus.DONE);
            return new CoinCreateResponse(savedCoin, member);
        } catch (Exception e) {
            log.error("Failed to create coin - OrderId: {}, Error: {}", request.orderId(), e.getMessage(), e);
            PaymentFailedEvent paymentFailedEvent = new PaymentFailedEvent(
                    request.orderId(),
                    crewId,
                    request.paymentKey()
            );
            eventPublisher.publishEvent(paymentFailedEvent);
            throw e;
        }
    }

    public void paymentFailure(Member member, CoinPaymentFailRequest request) {
        Crew crew = crewService.getByMemberId(member.getId());
        paymentService.changePaymentStatus(request.orderId(), crew.getId(), PaymentStatus.READY, PaymentStatus.FAILED);
    }
}
