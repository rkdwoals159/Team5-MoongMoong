package com.moong.facade.payment;


import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

import com.moong.event.payment.PaymentFailedEvent;
import com.moong.dto.response.payment.TossCancelResponse;
import com.moong.domain.bank.Bank;
import com.moong.domain.bank.Coin;
import com.moong.domain.bank.CoinPayment;
import com.moong.domain.crew.Crew;
import com.moong.domain.member.Member;
import com.moong.domain.pet.Pet;
import com.moong.domain.petgroup.PetGroup;
import com.moong.domain.enums.PaymentStatus;
import com.moong.dto.request.bank.CoinCreateRequest;
import com.moong.dto.request.payment.CoinPaymentConfirmRequest;
import com.moong.dto.request.payment.CoinPaymentFailRequest;
import com.moong.dto.response.bank.CoinCreateResponse;
import com.moong.dto.response.bank.CoinPaymentCreateResponse;
import com.moong.event.notification.GroupEventChannelSender;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.bank.CoinPaymentRepository;
import com.moong.repository.bank.CoinRepository;
import com.moong.service.bank.BankService;
import com.moong.service.BaseServiceTest;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.event.ApplicationEvents;
import org.springframework.test.context.event.RecordApplicationEvents;

@RecordApplicationEvents
class PaymentFacadeServiceTest extends BaseServiceTest {

    @Autowired
    private PaymentFacadeService paymentFacadeService;

    @Autowired
    private CoinRepository coinRepository;

    @Autowired
    private CoinPaymentRepository coinPaymentRepository;

    @MockitoBean
    private GroupEventChannelSender groupEventChannelSender;

    @Autowired
    private ApplicationEvents applicationEvents;


    @Nested
    class Payment {

        @DisplayName("결제 요청 정보가 주어지면, 결제 대기 상태의 CoinPayment를 생성한다")
        @Test
        void createCoinPayment_Success() {
            // Given
            Member member = memberGenerator.generateSaved("member");
            Pet savedPet = petGenerator.generateSaved();
            PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
            Crew crew = crewGenerator.generateSaved(petGroup, member);

            long amount = 100;
            CoinCreateRequest coinCreateRequest = new CoinCreateRequest(amount);

            CoinPaymentCreateResponse response = paymentFacadeService.createCoinPayment(member, coinCreateRequest);

            CoinPayment savedCoinPayment = coinPaymentRepository.findByIdAndCrew_Id(
                    response.orderId(),
                    crew.getId()
            ).get();

            assertAll(
                    () -> assertThat(response.amount()).isEqualTo(amount),
                    () -> assertThat(response.orderId()).isEqualTo(savedCoinPayment.getId()),
                    () -> assertThat(savedCoinPayment.getPaymentStatus()).isEqualTo(PaymentStatus.READY)
            );
        }

        @DisplayName("결제 승인이 완료되면 사용자의 저금통에 코인이 정상적으로 생성된다")
        @Test
        void paymentSuccess() {
            long amount = 100L;
            Pet savedPet = petGenerator.generateSaved();
            PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
            Member member = memberGenerator.generateSaved("member");
            Crew crew = crewGenerator.generateSaved(petGroup, member);
            Bank bank = bankGenerator.generateSaved(petGroup, 150000L, 0L);
            CoinPayment coinPayment = coinPaymentGenerator.generateSaved(amount, crew);

            CoinPaymentConfirmRequest request = new CoinPaymentConfirmRequest(
                    coinPayment.getId(), amount, "paymentTestKey"
            );
            CoinCreateResponse response = paymentFacadeService.paymentSuccess(member, request);

            List<Coin> coins = coinRepository.findFetchedAllByBank_Id(bank.getId(), Sort.unsorted());
            CoinPayment updatedCoinPayment = coinPaymentRepository
                    .findByIdAndCrew_Id(coinPayment.getId(), crew.getId()).get();

            assertAll(
                    () -> assertThat(response.amount())
                            .isEqualTo(amount),
                    () -> assertThat(response.name())
                            .isEqualTo("member"),
                    () -> assertThat(coins).hasSize(1),
                    () -> assertThat(response.coinId())
                            .isEqualTo(coins.get(0).getId()),
                    () -> assertThat(updatedCoinPayment.getPaymentStatus())
                            .isEqualTo(PaymentStatus.DONE)
            );
        }

        @DisplayName("결제 승인 실패 시 코인 생성 로직을 호출하지 않고 결제 상태만 FAILED로 업데이트한다")
        @Test
        void paymentConfirmFail_Then_ChangeStatusToFailed() {
            long amount = 100L;
            Pet savedPet = petGenerator.generateSaved();
            PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
            Member member = memberGenerator.generateSaved("member");
            Crew crew = crewGenerator.generateSaved(petGroup, member);
            Bank bank = bankGenerator.generateSaved(petGroup, 150000L, 0L);
            CoinPayment coinPayment = coinPaymentGenerator.generateSaved(amount, crew);

            CoinPaymentConfirmRequest request = new CoinPaymentConfirmRequest(
                    coinPayment.getId(), amount, "paymenttestKey"
            );

            Mockito.when(tossPaymentClient.confirm(any()))
                    .thenReturn(
                            CompletableFuture.failedFuture(new BusinessException(ErrorCode.TOSS_PAYMENT_CLIENT_ERROR))
                    );

            assertThatThrownBy(() -> paymentFacadeService.paymentSuccess(member, request))
                    .hasCauseInstanceOf(BusinessException.class);

            assertThat(applicationEvents.stream(PaymentFailedEvent.class))
                    .hasSize(1);
        }

        @DisplayName("결제 승인은 성공했으나 코인 생성 중 예외가 발생하면, 결제를 취소하고 기존 예외를 던진다")
        @Test
        void paymentSuccess_but_createCoin_fails_then_cancel() {
            BankService mockBankService = Mockito.mock(BankService.class);
            long amount = 100L;
            Pet savedPet = petGenerator.generateSaved();
            PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
            Member member = memberGenerator.generateSaved("member");
            Crew crew = crewGenerator.generateSaved(petGroup, member);

            CoinPayment coinPayment = coinPaymentGenerator.generateSaved(amount, crew);

            CoinPaymentConfirmRequest request = new CoinPaymentConfirmRequest(
                    coinPayment.getId(), amount, "paymenttestKey"
            );

            Mockito.when(mockBankService.createCoin(member, crew, amount))
                    .thenThrow(new BusinessException(ErrorCode.NO_SUCH_BANK_FOUND));

            Mockito.when(tossPaymentClient.cancel(anyString(), any()))
                    .thenReturn(CompletableFuture.completedFuture(
                            new TossCancelResponse(PaymentStatus.CANCELED.name(), "lastTransactionKeytest")));

            assertThatThrownBy(() -> paymentFacadeService.paymentSuccess(member, request))
                    .isInstanceOf(BusinessException.class);

            assertThat(applicationEvents.stream(PaymentFailedEvent.class))
                    .hasSize(1);
        }

        @DisplayName("토스 결제 승인 요청이 실패하면, 결제 상태를 FAILED로 변경한다.")
        @Test
        void paymentFailure() {
            long amount = 100L;
            Pet savedPet = petGenerator.generateSaved();
            PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
            Member member = memberGenerator.generateSaved("member");
            Crew crew = crewGenerator.generateSaved(petGroup, member);

            CoinPayment coinPayment = coinPaymentGenerator.generateSaved(amount, crew);

            CoinPaymentFailRequest request = new CoinPaymentFailRequest(
                    "ALREADY_PROCESSED_PAYMENT",
                    "이미 처리된 결제 입니다.",
                    coinPayment.getId()
            );

            paymentFacadeService.paymentFailure(member, request);

            CoinPayment updatedCoinPayment = coinPaymentRepository.findByIdAndCrew_Id(
                    coinPayment.getId(),
                    crew.getId()
            ).get();
            assertThat(updatedCoinPayment.getPaymentStatus()).isEqualTo(PaymentStatus.FAILED);
        }
    }
}
