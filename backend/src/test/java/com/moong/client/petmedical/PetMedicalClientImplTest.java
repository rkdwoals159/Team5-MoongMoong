package com.moong.client.petmedical;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.client.BaseWebClientTest;
import com.moong.dto.response.petmedical.AiPetMedicalResponse;
import java.io.IOException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.client.ExchangeFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

class PetMedicalClientImplTest extends BaseWebClientTest {

    private AiPetMedicalClient petMedicalClient;

    @BeforeEach
    void setUp() {
        mockExchangeFunction = Mockito.mock(ExchangeFunction.class);
        WebClient.Builder webClientBuilder = WebClient.builder()
                .exchangeFunction(mockExchangeFunction);
        AiPetMedicalProperties proeprties = new AiPetMedicalProperties("baseUrl");
        petMedicalClient = new PetMedicalClientImpl(webClientBuilder, proeprties);
    }

    @DisplayName("스트림 PetMedical 응답을 Flux 형태로 가져올 수 있다")
    @Test
    void getPetMedical() throws IOException {
        mockClient(HttpStatus.OK, "pet-medical-response/success.text");

        Flux<AiPetMedicalResponse> results = petMedicalClient.getPetMedicalsStream();

        assertThat(results.blockLast()).isNotNull();
    }
}
