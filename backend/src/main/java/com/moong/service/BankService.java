package com.moong.service;

import com.moong.domain.bank.BankRankings;
import com.moong.domain.entity.Bank;
import com.moong.domain.entity.Coin;
import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.request.bank.BankCreateRequest;
import com.moong.dto.response.bank.BankBreakResponse;
import com.moong.dto.response.bank.BankCreateResponse;
import com.moong.dto.response.bank.BankInfoResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.BankRepository;
import com.moong.repository.CoinRepository;
import com.moong.repository.CrewRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BankService {

    private final BankRepository bankRepository;
    private final CoinRepository coinRepository;
    private final CrewRepository crewRepository;

    @Transactional
    public BankCreateResponse createBank(Member member,
                                         BankCreateRequest bankCreateRequest) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        PetGroup petGroup = crew.getPetGroup();

        validateAlreadyHasBank(petGroup);

        Bank bank = bankCreateRequest.toBank(petGroup);
        Bank savedBank = bankRepository.save(bank);

        return new BankCreateResponse(savedBank);
    }
  
    public BankInfoResponse findBankInfo(Member member) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        PetGroup petGroup = crew.getPetGroup();
        Bank foundBank = bankRepository.getByPetGroupId(petGroup.getId());

        //crew > member fetch join
        List<Coin> bankCoins = coinRepository.findFetchedAllByBank_Id(foundBank.getId());
        BankRankings bankRankings = new BankRankings(bankCoins);
        return new BankInfoResponse(foundBank, bankRankings);
    }

    public BankBreakResponse breakBank(Member member) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        PetGroup petGroup = crew.getPetGroup();
        Bank groupBank = bankRepository.getByPetGroupId(petGroup.getId());

        if (!groupBank.canBreak()) {
            throw new BusinessException(ErrorCode.NOT_SUCCEED_BANK_TARGET_AMOUNT);
        }

        bankRepository.deleteById(groupBank.getId());
        return new BankBreakResponse(groupBank.getCreatedAt());
    }

    private void validateAlreadyHasBank(PetGroup petGroup) {
        bankRepository.findByPetGroupId(petGroup.getId())
                .ifPresent(bank -> {
                    throw new BusinessException(ErrorCode.ALREADY_EXISTS_BANK);
                });
    }
}
