package com.moong.facade.bank;

import com.moong.domain.crew.Crew;
import com.moong.domain.member.Member;
import com.moong.dto.response.bank.BankBreakResponse;
import com.moong.dto.response.bank.BankWithBankBreakResponse;
import com.moong.event.group.EventType;
import com.moong.event.notification.GroupEventPublisher;
import com.moong.event.group.GroupEventMessage;
import com.moong.event.group.payload.NudgePayload;
import com.moong.service.bank.BankService;
import com.moong.service.crew.CrewService;
import com.moong.service.ranking.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BankFacadeService {

    private final BankService bankService;
    private final RankingService rankingService;
    private final CrewService crewService;
    private final GroupEventPublisher groupEventPublisher;

    public void createGroupNudge(Member member) {
        Crew crew = crewService.getFetchedByMemberId(member.getId());
        NudgePayload nudgePayload = new NudgePayload(crew.getMember().getName());
        GroupEventMessage<NudgePayload> groupEventMessage = new GroupEventMessage<>(
                EventType.NUDGE,
                crew.getPetGroup().getId(),
                member.getId(),
                nudgePayload,
                EventType.NUDGE.includeSender()
        );
        groupEventPublisher.publishAsync(groupEventMessage);
    }

    public BankBreakResponse breakBank(Member member) {
        BankWithBankBreakResponse bankWithBankBreakResponse = bankService.breakBank(member);
        rankingService.deleteRanking(bankWithBankBreakResponse.bankId());
        return bankWithBankBreakResponse.bankBreakResponse();
    }
}
