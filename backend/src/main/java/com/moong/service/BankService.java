package com.moong.service;

import com.moong.domain.bank.BankRankings;
import com.moong.domain.bank.CoinView;
import com.moong.domain.entity.Bank;
import com.moong.domain.entity.Coin;
import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.request.bank.BankCreateRequest;
import com.moong.dto.request.bank.BankUpdateRequest;
import com.moong.dto.response.bank.BankBreakResponse;
import com.moong.dto.response.bank.BankCreateResponse;
import com.moong.dto.response.bank.BankInfoResponse;
import com.moong.dto.response.bank.BankUpdateResponse;
import com.moong.dto.response.bank.CoinCreateResponse;
import com.moong.dto.response.bank.CoinsResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.BankRepository;
import com.moong.repository.CoinRepository;
import com.moong.repository.CrewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public CoinCreateResponse createCoin(Member member, Crew crew, long amount) {
        PetGroup petGroup = crew.getPetGroup();
        Bank groupBank = bankRepository.getByPetGroupId(petGroup.getId());

        groupBank.updateCurrentAmount(amount);
        Coin coin = new Coin(groupBank, crew, amount);
        Coin savedCoin = coinRepository.save(coin);
        return new CoinCreateResponse(savedCoin, member);
    }

    public BankInfoResponse findBankInfo(Member member) {
        Bank foundBank = findBank(member.getId());
        //crew > member fetch join
        List<Coin> bankCoins = coinRepository.findFetchedAllByBank_Id(foundBank.getId(), Sort.unsorted());
        BankRankings bankRankings = new BankRankings(bankCoins);
        return new BankInfoResponse(foundBank, bankRankings);
    }

    @Transactional
    public BankUpdateResponse updateBank(Member member,
                                         BankUpdateRequest bankUpdateRequest) {
        long target = bankUpdateRequest.target();
        Bank foundBank = findBank(member.getId());

        foundBank.updateTargetAmount(target);

        return new BankUpdateResponse(foundBank.getTargetAmount());
    }

    public BankBreakResponse breakBank(Member member) {
        Bank groupBank = findBank(member.getId());

        if (!groupBank.isSucceedTargetAmount()) {
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

    public CoinsResponse findCoins(Member member) {
        Bank foundBank = findBank(member.getId());
        Sort sort = Sort.by(Sort.Order.asc(Coin.CREATED_AT_COLUMN_NAME));
        List<CoinView> coinViews = coinRepository.getFetchedAllByBank_Id(foundBank.getId(), sort);
        return CoinsResponse.from(coinViews);
    }

    private Bank findBank(long memberId) {
        Crew crew = crewRepository.getByMemberId(memberId);
        PetGroup petGroup = crew.getPetGroup();
        return bankRepository.getByPetGroupId(petGroup.getId());
    }
}
