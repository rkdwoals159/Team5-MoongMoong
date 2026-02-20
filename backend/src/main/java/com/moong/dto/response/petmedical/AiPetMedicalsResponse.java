package com.moong.dto.response.petmedical;

import com.moong.domain.entity.PetMedical;
import java.util.List;

public record AiPetMedicalsResponse(
        List<AiPetMedicalResponse> predictions
) {

    public List<PetMedical> toPetMedicals() {
        return predictions.stream()
                .flatMap(predict -> predict.toPetMedical().stream())
                .toList();
    }
}
