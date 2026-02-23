package com.moong.event.payment;

import com.moong.event.GroupEventPublisher;
import com.moong.event.dto.CoinCreatedPayload;
import com.moong.event.dto.GroupEventMessage;
import com.moong.event.dto.PaymentSuccessEvent;
import com.moong.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentSuccessEventListener {

    private final RankingService rankingService;
    private final GroupEventPublisher groupEventPublisher;

    @Async("paymentEventExecutor")
    @EventListener
    public void afterPaymentSuccess(PaymentSuccessEvent event) {
        GroupEventMessage<CoinCreatedPayload> savingMessage =
                GroupEventMessage.saving(event.member(), event.groupId(), event.coin());

        groupEventPublisher.publishAsync(savingMessage);
        rankingService.updateRanking(event.member(), event.coin().getAmount());
    }
}
