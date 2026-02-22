package com.moong.event;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

import com.moong.domain.entity.CoinPayment;
import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.enums.PaymentStatus;
import com.moong.dto.PaymentFailedEvent;
import com.moong.dto.response.payment.TossCancelResponse;
import com.moong.event.payment.PaymentFailEventListener;
import com.moong.repository.CoinPaymentRepository;
import com.moong.service.BaseServiceTest;
import java.util.concurrent.CompletableFuture;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;

class PaymentFailEventListenerTest extends BaseServiceTest {

    @Autowired
    private PaymentFailEventListener paymentFailEventListener;

    @Autowired
    private CoinPaymentRepository coinPaymentRepository;

    @DisplayName("상태가 CONFIRM인 경우: 토스 취소를 호출하고 최종 상태를 FAILED로 변경한다")
    @Test
    void handleFailed_WhenConfirm_ThenCancelAndStatusFailed() {
        long amount = 100L;
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        Member member = memberGenerator.generateSaved("member");
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        CoinPayment coinPayment = coinPaymentGenerator.generateSaved(amount, crew, PaymentStatus.CONFIRMED);
        PaymentFailedEvent event = new PaymentFailedEvent(
                coinPayment.getId(),
                crew.getId(),
                "testPaymentKey"
        );

        Mockito.when(tossPaymentClient.cancel(anyString(), any()))
                .thenReturn(CompletableFuture.completedFuture(
                        new TossCancelResponse(PaymentStatus.CANCELED.name(), "lastTransactionKeytest")));

        paymentFailEventListener.handlePaymentFailed(event);

        Mockito.verify(tossPaymentClient, Mockito.times(1)).cancel(anyString(), any());
        CoinPayment updatedCoinPayment = coinPaymentRepository.findByIdAndCrew_Id(
                coinPayment.getId(),
                crew.getId()
        ).get();
        assertThat(updatedCoinPayment.getPaymentStatus()).isEqualTo(PaymentStatus.FAILED);
    }

    @DisplayName("상태가 READY인 경우: 토스 취소 없이 최종 상태만 FAILED로 변경한다")
    @Test
    void handleFailed_WhenReady_ThenOnlyStatusFailed() {
        long amount = 100L;
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        Member member = memberGenerator.generateSaved("member");
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        CoinPayment coinPayment = coinPaymentGenerator.generateSaved(amount, crew, PaymentStatus.READY);
        PaymentFailedEvent event = new PaymentFailedEvent(
                coinPayment.getId(),
                crew.getId(),
                "testPaymentKey"
        );

        paymentFailEventListener.handlePaymentFailed(event);

        CoinPayment updatedCoinPayment = coinPaymentRepository.findByIdAndCrew_Id(
                coinPayment.getId(),
                crew.getId()
        ).get();
        assertThat(updatedCoinPayment.getPaymentStatus()).isEqualTo(PaymentStatus.FAILED);
    }
}
