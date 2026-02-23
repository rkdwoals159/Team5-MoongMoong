package com.moong.fixture;

import com.moong.domain.bank.Bank;
import com.moong.domain.petgroup.PetGroup;
import com.moong.repository.bank.BankRepository;
import org.springframework.stereotype.Component;

@Component
public class BankGenerator {

    private final BankRepository bankRepository;

    public BankGenerator(BankRepository bankRepository) {
        this.bankRepository = bankRepository;
    }

    public Bank generateSaved(PetGroup petGroup, long targetAmount, long currentAmount) {
        Bank bank = new Bank(null, petGroup, targetAmount, currentAmount);
        return bankRepository.save(bank);
    }
}
