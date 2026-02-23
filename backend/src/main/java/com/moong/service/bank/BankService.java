package com.moong.service.bank;

import com.moong.domain.ranking.BankRankings;
import com.moong.domain.bank.Bank;
import com.moong.domain.bank.Coin;
import com.moong.domain.crew.Crew;
import com.moong.domain.member.Member;
import com.moong.domain.petgroup.PetGroup;
import com.moong.dto.request.bank.BankCreateRequest;
import com.moong.dto.request.bank.BankUpdateRequest;
import com.moong.dto.response.bank.BankBreakResponse;
import com.moong.dto.response.bank.BankCreateResponse;
import com.moong.dto.response.bank.BankInfoResponse;
import com.moong.dto.response.bank.BankUpdateResponse;
import com.moong.dto.response.bank.BankWithBankBreakResponse;
import com.moong.dto.response.bank.CoinsResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.bank.BankRepository;
import com.moong.repository.bank.CoinRepository;
import com.moong.repository.crew.CrewRepository;
import com.moong.service.ranking.RankingService;
import com.moong.view.bank.CoinView;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BankService {

    private final RankingService rankingService;

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
    public Coin createCoin(Member member, Crew crew, long amount) {
        PetGroup petGroup = crew.getPetGroup();
        Bank groupBank = bankRepository.getByPetGroupId(petGroup.getId());

        groupBank.updateCurrentAmount(amount);
        Coin coin = new Coin(groupBank, crew, amount);
        return coinRepository.save(coin);
    }

    public BankInfoResponse findBankInfo(Member member) {
        Bank foundBank = findBank(member.getId());
        BankRankings bankRankings = rankingService.getRanking(foundBank.getId(), foundBank.isCurrentAmountZero());
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

    public BankWithBankBreakResponse breakBank(Member member) {
        Bank groupBank = findBank(member.getId());

        if (!groupBank.isSucceedTargetAmount()) {
            throw new BusinessException(ErrorCode.NOT_SUCCEED_BANK_TARGET_AMOUNT);
        }

        bankRepository.deleteById(groupBank.getId());
        BankBreakResponse bankBreakResponse = new BankBreakResponse(groupBank.getCreatedAt());
        return new BankWithBankBreakResponse(groupBank.getId(), bankBreakResponse);
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
