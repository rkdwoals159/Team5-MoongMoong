package com.moong.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.moong.domain.entity.CoinPayment;
import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.fixture.CoinPaymentGenerator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class PaymentServiceTest extends BaseServiceTest {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private CoinPaymentGenerator coinPaymentGenerator;

    @DisplayName("결제 검증 실패 : 존재하지 않는 결제 정보일 때 NO_SUCH_COIN_PAYMENT_FOUND 발생")
    @Test
    public void verifyPaymentFailWhenStatusNotReady() {
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        Member member = memberGenerator.generateSaved("member");
        Crew crew = crewGenerator.generateSaved(petGroup, member);

        assertThatThrownBy(() -> paymentService.verifyPayment(null, crew.getId(), 100L))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.NO_SUCH_COIN_PAYMENT_FOUND.getMessage());
    }

    @DisplayName("결제하기 실패 : 결제 요청 금액과 실제 주문 금액이 일치하지 않음")
    @Test
    void verifyPaymentFailWhenAmountNotMatch() {
        long originalAmount = 1000L;
        long differentAmount = 2000L;

        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        Member member = memberGenerator.generateSaved("member");
        Crew crew = crewGenerator.generateSaved(petGroup, member);

        CoinPayment coinPayment = coinPaymentGenerator.generateSaved(originalAmount, crew);

        assertThatThrownBy(() -> paymentService.verifyPayment(coinPayment.getId(), crew.getId(), differentAmount))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.INVALID_PAYMENT_AMOUNT.getMessage());
    }

    @DisplayName("결제하기 전에 저장해 놓았던 데이터 검증 성공")
    @Test
    public void verifyPayment() {
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        Member member = memberGenerator.generateSaved("member");
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        CoinPayment coinPayment = coinPaymentGenerator.generateSaved(100L, crew);

        paymentService.verifyPayment(coinPayment.getId(), crew.getId(), 100L);
    }
}
