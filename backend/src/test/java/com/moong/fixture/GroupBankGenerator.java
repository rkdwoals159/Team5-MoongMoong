package com.moong.fixture;

import com.moong.domain.entity.Bank;
import com.moong.domain.entity.PetGroup;
import com.moong.repository.BankRepository;
import org.springframework.boot.context.properties.ConfigurationProperties;
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
