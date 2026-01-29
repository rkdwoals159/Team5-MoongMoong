package com.moong.service;

import com.moong.domain.entity.Bank;
import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.request.bank.BankCreateRequest;
import com.moong.dto.response.bank.BankCreateResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.BankRepository;
import com.moong.repository.CrewRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BankService {

    private final BankRepository bankRepository;
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

    private void validateAlreadyHasBank(PetGroup petGroup) {
        bankRepository.findByPetGroupId(petGroup.getId())
                .ifPresent(bank -> {
                    throw new BusinessException(ErrorCode.ALREADY_EXISTS_BANK);
                });
    }
}
