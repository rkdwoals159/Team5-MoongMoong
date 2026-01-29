package com.moong.domain.groupmedical;

import com.moong.domain.entity.PetMedical;
import com.moong.domain.enums.Disease;
import com.moong.domain.pet.PetAge;
import java.time.LocalDate;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class DiseaseRatio {

    private final int year;
    private final Disease disease;
    private final int ratio;

    public DiseaseRatio(PetMedical petMedical, PetAge petAge) {
        this.year = LocalDate.now().getYear() + (petMedical.getAge() - petAge.getValue());
        this.disease = petMedical.getDisease();
        this.ratio = petMedical.getRatio();
    }

    public boolean isDisease(Disease disease) {
        return this.disease.isSame(disease);
    }
}
