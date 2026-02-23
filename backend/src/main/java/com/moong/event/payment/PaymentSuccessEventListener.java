package com.moong.event.payment;

import com.moong.event.notification.GroupEventPublisher;
import com.moong.event.group.payload.CoinCreatedPayload;
import com.moong.event.group.GroupEventMessage;
import com.moong.service.ranking.RankingService;
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
