package com.moong.domain.entity;

import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertAll;

class BankTest {
    @DisplayName("저금통 목표 금액 변경 실패 : 현재 저금통에 쌓인 금액보다 낮은 금액으로 변경 시도")
    @Test
    void updateBankFailWhenTargetAmountLessThanCurrent() {
        Bank bank = new Bank(null, null, 5000L, 3000L);

        assertThatThrownBy(() -> bank.updateTargetAmount(2999L))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.BANK_TARGET_LESS_THAN_CURRENT.getMessage());
    }

    @DisplayName("저금통 목표 금액 변경 실패 : 목표 금액이 0 이하")
    @Test
    void updateBankFailWhenTargetAmountBelowZero() {
        Bank bank = new Bank(null, null, 5000L, 3000L);

        assertAll(
                () -> assertThatThrownBy(() -> bank.updateTargetAmount(0L))
                        .isInstanceOf(BusinessException.class)
                        .hasMessage(ErrorCode.BANK_TARGET_BELOW_ZERO.getMessage()),
                () -> assertThatThrownBy(() -> bank.updateTargetAmount(-1L))
                        .isInstanceOf(BusinessException.class)
                        .hasMessage(ErrorCode.BANK_TARGET_BELOW_ZERO.getMessage())
        );
    }

    @DisplayName("저금통 목표 금액 변경 실패 : 목표 1000만원 초과")
    @Test
    void updateBankFailWhenTargetAmountExceedLimit() {
        Bank bank = new Bank(null, null, 5000L, 3000L);

        assertThatThrownBy(() -> bank.updateTargetAmount(10_000_001L))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.BANK_TARGET_EXCEED_LIMIT.getMessage());
    }
}
