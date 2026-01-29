package com.moong.repository;

import com.moong.domain.entity.Bank;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

public interface BankRepository extends Repository<Bank, Long> {

    Bank save(Bank bank);

    Optional<Bank> findByPetGroupId(long id);

    List<Bank> findAllByPetGroupId(long id);
}
