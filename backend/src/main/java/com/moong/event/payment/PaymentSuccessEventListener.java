package com.moong.event.payment;

import com.moong.dto.command.NotificationCreateCommand;
import com.moong.event.EventType;
import com.moong.event.dto.CoinCreatedPayload;
import com.moong.event.dto.GroupEventMessage;
import com.moong.event.dto.PaymentSuccessEvent;
import com.moong.event.transport.GroupEventChannelSender;
import com.moong.service.NotificationService;
import com.moong.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentSuccessEventListener {

    private final GroupEventChannelSender groupEventChannelSender;
    private final NotificationService notificationService;
    private final RankingService rankingService;

    @Async("paymentEventExecutor")
    @EventListener
    public void afterPaymentSuccess(PaymentSuccessEvent event) {
        GroupEventMessage<CoinCreatedPayload> savingMessage =
                GroupEventMessage.saving(event.member(), event.groupId(), event.coin());

        NotificationCreateCommand notificationCreateCommand = new NotificationCreateCommand(
                event.groupId(),
                event.crew(),
                savingMessage.data(),
                EventType.SAVING
        );
        notificationService.createCrewNotification(notificationCreateCommand);
        groupEventChannelSender.sendAsync(savingMessage);
        rankingService.updateRanking(event.member(), event.coin().getAmount());
    }
}
