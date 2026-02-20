package com.moong.config;

import com.moong.client.petmedical.AiPetMedicalClient;
import com.moong.dto.response.petmedical.AiPetMedicalResponse;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Primary
@Profile("test")
@Component
public class FakePetMedicalClient implements AiPetMedicalClient {

    @Override
    public Flux<AiPetMedicalResponse> getPetMedicalsStream() {
        return null;
    }
}
