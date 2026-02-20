package com.moong.dto.response.petmedical;

import com.moong.domain.entity.PetMedical;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import java.util.List;
import java.util.stream.IntStream;

public record AiPetMedicalResponse(
        Disease disease,
        Breed breed,
        Gender sex,
        List<Double> diseasePercent
) {

    public List<PetMedical> toPetMedical() {
        return IntStream.range(0, diseasePercent.size())
                .mapToObj(i -> toPetMedical(diseasePercent.get(i), i))
                .toList();
    }

    private PetMedical toPetMedical(double ratio, int age) {
        return new PetMedical(
                null,
                breed,
                age,
                sex,
                disease,
                (int) Math.round(ratio)
        );
    }

}
