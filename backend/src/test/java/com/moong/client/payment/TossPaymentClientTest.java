package com.moong.client.payment;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.client.BaseWebClientTest;
import com.moong.domain.enums.PaymentStatus;
import com.moong.dto.request.payment.CoinPaymentConfirmRequest;
import com.moong.dto.request.payment.TossCancelRequest;
import com.moong.dto.response.payment.TossCancelResponse;
import com.moong.dto.response.payment.TossConfirmResponse;
import java.io.IOException;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.reactive.function.client.ExchangeFunction;
import org.springframework.web.reactive.function.client.WebClient;

@ActiveProfiles("test")
public class TossPaymentClientTest extends BaseWebClientTest {

    private TossPaymentClient tossPaymentClient;

    @BeforeEach
    public void setUp() {
        mockExchangeFunction = Mockito.mock(ExchangeFunction.class);

        WebClient.Builder webClientBuilder = WebClient.builder()
                .exchangeFunction(mockExchangeFunction);
        TossProperties tossProperties = new TossProperties("https://api.tosspayments.com/v1/payments", "testKey", "");
        tossPaymentClient = new TossPaymentClient(webClientBuilder, tossProperties);
    }

    @Nested
    class TossAPI {

        @DisplayName("성공: 결제 승인 응답이 TossConfirmResponse로 매핑된다")
        @Test
        void confirm() throws IOException {
            UUID uuid = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");
            String paymentKey = "testPaymentKey";
            long totalAmount = 100L;
            CoinPaymentConfirmRequest request = new CoinPaymentConfirmRequest(
                    uuid,
                    totalAmount,
                    paymentKey
            );
            mockClient(HttpStatus.OK, "toss-response/confirm.json");

            TossConfirmResponse response = tossPaymentClient.confirm(request).join();

            assertAll(
                    () -> assertThat(response.paymentKey()).isEqualTo(paymentKey),
                    () -> assertThat(response.orderId()).isEqualTo(uuid),
                    () -> assertThat(response.status()).isEqualTo(PaymentStatus.DONE.name()),
                    () -> assertThat(response.totalAmount()).isEqualTo(totalAmount)
            );
        }

        @DisplayName("성공: 결제 취소 응답이 TossCancelResponse로 매핑된다")
        @Test
        void cancel() throws IOException {
            String paymentKey = "testPaymentKey";
            String lastTransactionKey = "090A796806E726BBB929F4A2CA7DB9A7";
            TossCancelRequest request = TossCancelRequest.forInternalError();
            mockClient(HttpStatus.OK, "toss-response/cancel.json");

            TossCancelResponse response = tossPaymentClient.cancel(paymentKey, request).join();

            assertAll(
                    () -> assertThat(response.status()).isEqualTo("CANCELED"),
                    () -> assertThat(response.lastTransactionKey()).isEqualTo(lastTransactionKey)
            );
        }
    }
}
