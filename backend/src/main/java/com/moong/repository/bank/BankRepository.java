package com.moong.repository.bank;

import com.moong.domain.bank.Bank;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

public interface BankRepository extends Repository<Bank, Long> {

    Bank save(Bank bank);

    Optional<Bank> findByPetGroupId(long id);

    default Bank getByPetGroupId(long petGroupId) {
        return findByPetGroupId(petGroupId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NO_SUCH_BANK_FOUND));
    }

    List<Bank> findAllByPetGroupId(long id);

    void deleteById(long id);
}
