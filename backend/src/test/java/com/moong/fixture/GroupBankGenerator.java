package com.moong.fixture;

import com.moong.domain.bank.Bank;
import com.moong.domain.petgroup.PetGroup;
import com.moong.repository.bank.BankRepository;
import org.springframework.stereotype.Component;

@Component
public class GroupBankGenerator {

    private final BankRepository bankRepository;

    public GroupBankGenerator(BankRepository bankRepository) {
        this.bankRepository = bankRepository;
    }

    public Bank generateSaved(PetGroup petGroup, long targetAmount) {
        Bank bank = new Bank(petGroup, targetAmount);
        return bankRepository.save(bank);
    }
}
