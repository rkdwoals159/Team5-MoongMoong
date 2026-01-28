package com.moong.domain.pet;

import com.moong.domain.entity.PetMedical;
import com.moong.domain.enums.Disease;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.util.Comparator;
import java.util.List;
import lombok.Getter;

@Getter
public class PetMedicals {

    private static final Comparator<PetMedical> PET_MEDICAL_RATIO_COMPARATOR =
            Comparator.comparing(PetMedical::getRatio).reversed();

    private final List<Disease> diseases;

    public PetMedicals(List<PetMedical> petMedicals) {
        this.diseases = petMedicals.stream()
                .sorted(PET_MEDICAL_RATIO_COMPARATOR)
                .map(PetMedical::getDisease)
                .toList();
        validatePetDiseaseCount();
    }

    private void validatePetDiseaseCount() {
        if (diseases.size() != Disease.values().length) {
            throw new BusinessException(ErrorCode.INCONSISTENT_DISEASE_DATA);
        }
    }
}
