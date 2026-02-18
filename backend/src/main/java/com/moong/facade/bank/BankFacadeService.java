package com.moong.facade.bank;

import com.moong.domain.entity.Member;
import com.moong.dto.response.bank.BankBreakResponse;
import com.moong.dto.response.bank.BankWithBankBreakResponse;
import com.moong.service.BankService;
import com.moong.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BankFacadeService {

    private final BankService bankService;
    private final RankingService rankingService;

    public BankBreakResponse breakBank(Member member) {
        BankWithBankBreakResponse bankWithBankBreakResponse = bankService.breakBank(member);
        rankingService.deleteRanking(bankWithBankBreakResponse.bankId());
        return bankWithBankBreakResponse.bankBreakResponse();
    }
}
