package com.moong.client.petmedical;

import com.moong.dto.response.petmedical.AiPetMedicalResponse;
import reactor.core.publisher.Flux;

public interface AiPetMedicalClient {

    Flux<AiPetMedicalResponse> getPetMedicalsStream();
}
