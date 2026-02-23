package com.moong.domain.entity;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.moong.domain.bank.CoinPayment;
import com.moong.domain.crew.Crew;
import com.moong.domain.enums.PaymentStatus;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.Mockito;

class CoinPaymentTest {

    @DisplayName("결제 금액은 주어진 범위 이내여야 한다")
    @ValueSource(longs = {CoinPayment.MIN_PAYMENT_AMOUNT - 1, CoinPayment.MAX_PAYMENT_AMOUNT + 1})
    @ParameterizedTest
    void validateAmount(long invalidAmount) {
        assertThatThrownBy(() -> new CoinPayment(
                    UUID.randomUUID(),
                    invalidAmount,
                    Mockito.mock(Crew.class),
                    PaymentStatus.READY
                )).isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.INVALID_PAYMENT_AMOUNT.getMessage());
    }
}
