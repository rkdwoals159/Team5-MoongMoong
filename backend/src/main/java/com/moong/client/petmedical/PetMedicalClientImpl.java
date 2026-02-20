package com.moong.client.petmedical;

import com.moong.dto.response.petmedical.AiPetMedicalResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

@Component
@EnableConfigurationProperties(AiPetMedicalProperties.class)
public class PetMedicalClientImpl implements AiPetMedicalClient {

    private final WebClient webClient;
    private final AiPetMedicalProperties properties;

    public PetMedicalClientImpl(
            @Qualifier(value = "petMedicalClientBuilder")
            WebClient.Builder webClientBuilder,
            AiPetMedicalProperties properties
    ) {
        this.webClient = webClientBuilder.build();
        this.properties = properties;
    }

    @Override
    public Flux<AiPetMedicalResponse> getPetMedicalsStream() {
        return webClient.get()
                .uri(properties.baseUrl() + "/predict-stream")
                .retrieve()
                .bodyToFlux(AiPetMedicalResponse.class);
    }
}
