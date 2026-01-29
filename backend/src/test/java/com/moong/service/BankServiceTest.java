package com.moong.service;

import com.moong.domain.entity.Bank;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.request.bank.BankCreateRequest;
import com.moong.dto.response.bank.BankCreateResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.BankRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

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

}
