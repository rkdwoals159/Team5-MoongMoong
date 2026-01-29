package com.moong.fixture;

import com.moong.domain.entity.Bank;
import com.moong.domain.entity.PetGroup;
import com.moong.repository.BankRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;

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
