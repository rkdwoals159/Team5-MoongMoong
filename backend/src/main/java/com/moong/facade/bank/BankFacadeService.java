package com.moong.facade.bank;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.dto.command.NotificationCreateCommand;
import com.moong.dto.response.bank.BankBreakResponse;
import com.moong.dto.response.bank.BankWithBankBreakResponse;
import com.moong.event.EventType;
import com.moong.event.dto.GroupEventMessage;
import com.moong.event.dto.NudgePayload;
import com.moong.event.transport.GroupEventChannelSender;
import com.moong.service.BankService;
import com.moong.service.CrewService;
import com.moong.service.NotificationService;
import com.moong.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BankFacadeService {

    private final BankService bankService;
    private final RankingService rankingService;
    private final NotificationService notificationService;
    private final GroupEventChannelSender groupEventChannelSender;
    private final CrewService crewService;

    public void createGroupNudge(Member member) {
        Crew crew = crewService.getFetchedByMemberId(member.getId());
        NudgePayload nudgePayload = new NudgePayload(crew.getMember().getName());
        NotificationCreateCommand notificationCreateCommand =
                new NotificationCreateCommand(
                        crew.getPetGroup().getId(),
                        crew,
                        nudgePayload,
                        EventType.NUDGE
                );
        GroupEventMessage<NudgePayload> groupEventMessage = new GroupEventMessage<>(
                EventType.NUDGE,
                crew.getPetGroup().getId(),
                member.getId(),
                nudgePayload
        );
        notificationService.createCrewNotification(notificationCreateCommand);
        groupEventChannelSender.sendAsync(groupEventMessage);
    }

    public BankBreakResponse breakBank(Member member) {
        BankWithBankBreakResponse bankWithBankBreakResponse = bankService.breakBank(member);
        rankingService.deleteRanking(bankWithBankBreakResponse.bankId());
        return bankWithBankBreakResponse.bankBreakResponse();
    }
}
