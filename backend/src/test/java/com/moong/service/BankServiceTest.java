package com.moong.service;

import com.moong.domain.bank.Bank;
import com.moong.domain.bank.Coin;
import com.moong.domain.crew.Crew;
import com.moong.domain.member.Member;
import com.moong.domain.pet.Pet;
import com.moong.domain.petgroup.PetGroup;
import com.moong.dto.request.bank.BankCreateRequest;
import com.moong.dto.response.bank.BankCreateResponse;
import com.moong.dto.response.bank.BankInfoResponse;
import com.moong.dto.response.bank.CoinResponse;
import com.moong.dto.response.bank.CoinsResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.bank.BankRepository;
import com.moong.service.bank.BankService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.within;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertAll;

class BankServiceTest extends BaseServiceTest {

    @Autowired
    private BankService bankService;

    @Autowired
    private BankRepository bankRepository;

    @DisplayName("저금통을 생성할 수 있다")
    @Test
    void createBankSuccess() {
        Member member = memberGenerator.generateSaved("member");
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        crewGenerator.generateSaved(petGroup, member);
        long targetAmount = 150000L;

        BankCreateRequest bankCreateRequest = new BankCreateRequest(150000L);
        BankCreateResponse response = bankService.createBank(member, bankCreateRequest);

        assertThat(response.target()).isEqualTo(targetAmount);
    }

    @DisplayName("저금통이 이미 존재할 때 예외를 반환한다.")
    @Test
    void createBankFail() {
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        Member member = memberGenerator.generateSaved("member");
        crewGenerator.generateSaved(petGroup, member);
        Bank bank = new Bank(petGroup, 150000L);
        bankRepository.save(bank);

        BankCreateRequest bankCreateRequest = new BankCreateRequest(200000L);
        assertThatThrownBy(() -> {
            bankService.createBank(member, bankCreateRequest);
        })
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.ALREADY_EXISTS_BANK.getMessage());
    }

    @DisplayName("""
               동시성 이슈 테스트: 동시에 저금통 생성을 시도할 때,
               한번만 저금통 생성에 성공한다
            """)
    @Test
    void canHandleConcurrencyTest() throws InterruptedException {
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        Member member = memberGenerator.generateSaved("member");
        crewGenerator.generateSaved(petGroup, member);
        BankCreateRequest bankCreateRequest = new BankCreateRequest(150000);

        runAtSameTime(3, () -> {
            try {
                bankService.createBank(member, bankCreateRequest);
            } catch (Exception e) {
            }
        });

        List<Bank> banks = bankRepository.findAllByPetGroupId(petGroup.getId());
        assertThat(banks.size()).isEqualTo(1);
    }

    @DisplayName("저금통 삭제에 성공한다")
    @Test
    void breakBankSuccess() {
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        Member member = memberGenerator.generateSaved("member");
        crewGenerator.generateSaved(petGroup, member);
        bankGenerator.generateSaved(petGroup, 10L, 10L);

        assertThatCode(() -> bankService.breakBank(member))
                .doesNotThrowAnyException();
    }

    @DisplayName("저금통이 목표금액을 달성하지 못한 경우 삭제에 실패한다")
    @Test
    void breakBankFailWhenNotSucceedTargetAmount() {
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        Member member = memberGenerator.generateSaved("member");
        crewGenerator.generateSaved(petGroup, member);
        bankGenerator.generateSaved(petGroup, 10L, 9L);

        assertThatThrownBy(() -> bankService.breakBank(member))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.NOT_SUCCEED_BANK_TARGET_AMOUNT.getMessage());
    }

    @DisplayName("저금통이 없는 경우 삭제에 실패한다")
    @Test
    void breakBankFail() {
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        Member member = memberGenerator.generateSaved("member");
        crewGenerator.generateSaved(petGroup, member);

        assertThatThrownBy(() -> bankService.breakBank(member))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.NO_SUCH_BANK_FOUND.getMessage());
    }

    @DisplayName("저금통 정보 및 랭킹 정보 조회에 성공한다")
    @Test
    void findBankInfoSuccess() {
        Member member1 = memberGenerator.generateSaved("member1");
        Member member2 = memberGenerator.generateSaved("member2");
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        Crew crew1 = crewGenerator.generateSaved(petGroup, member1);
        Crew crew2 = crewGenerator.generateSaved(petGroup, member2);
        long smallCoinAmount = 100L;
        long bigCoinAmount = 200L;
        Bank bank = bankGenerator.generateSaved(petGroup, 1000000L, smallCoinAmount + bigCoinAmount);
        Coin smallCoin = coinGenerator.generateSaved(bank, crew1, smallCoinAmount);
        Coin bigCoin = coinGenerator.generateSaved(bank, crew2, bigCoinAmount);

        BankInfoResponse bankInfo = bankService.findBankInfo(member1);

        assertAll(
                () -> assertThat(bankInfo.bankId()).isEqualTo(bank.getId()),
                () -> assertThat(bankInfo.target()).isEqualTo(bank.getTargetAmount()),
                () -> assertThat(bankInfo.current()).isEqualTo(bank.getCurrentAmount()),
                () -> assertThat(bankInfo.rankings()).hasSize(2),
                () -> assertThat(bankInfo.rankings().get(0).userName()).isEqualTo(member2.getName()),
                () -> assertThat(bankInfo.rankings().get(0).total()).isEqualTo(bigCoin.getAmount()),
                () -> assertThat(bankInfo.rankings().get(1).userName()).isEqualTo(member1.getName()),
                () -> assertThat(bankInfo.rankings().get(1).total()).isEqualTo(smallCoin.getAmount())
        );
    }

    @DisplayName("저금통 정보 조회 실패 : 저금통이 존재하지 않을 경우")
    @Test
    void findBankInfoFail() {
        Member member1 = memberGenerator.generateSaved("member1");
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        crewGenerator.generateSaved(petGroup, member1);

        assertThatThrownBy(() -> bankService.findBankInfo(member1))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.NO_SUCH_BANK_FOUND.getMessage());
    }

    @DisplayName("멤버가 속한 그룹의 저금통 저금 내역을 과거순으로 정렬해서 조회한다.")
    @Test
    void findCoins() {
        Member member1 = memberGenerator.generateSaved("member1");
        Member member2 = memberGenerator.generateSaved("member2");
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        Crew crew1 = crewGenerator.generateSaved(petGroup, member1);
        Crew crew2 = crewGenerator.generateSaved(petGroup, member2);
        Bank bank = bankGenerator.generateSaved(petGroup, 1000000L, 0L);
        Coin smallCoin = coinGenerator.generateSaved(bank, crew1, 100L);
        Coin bigCoin = coinGenerator.generateSaved(bank, crew2, 200L);

        CoinsResponse response = bankService.findCoins(member1);

        List<LocalDateTime> createdAts = response.coins().stream()
                .map(CoinResponse::createdAt)
                .toList();

        assertAll(
                () -> assertThat(response.coins()).hasSize(2),
                () -> assertThat(response.coins().get(0).amount()).isEqualTo(smallCoin.getAmount()),
                () -> assertThat(response.coins().get(0).name()).isEqualTo(member1.getName()),
                () -> assertThat(response.coins().get(0).createdAt())
                        .isCloseTo(smallCoin.getCreatedAt(), within(1, ChronoUnit.MICROS)),
                () -> assertThat(response.coins().get(1).amount()).isEqualTo(bigCoin.getAmount()),
                () -> assertThat(response.coins().get(1).name()).isEqualTo(member2.getName()),
                () -> assertThat(response.coins().get(1).createdAt())
                        .isCloseTo(bigCoin.getCreatedAt(), within(1, ChronoUnit.MICROS)),
                () -> assertThat(createdAts).isSorted()
        );
    }
}
