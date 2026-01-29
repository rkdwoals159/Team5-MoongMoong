package com.moong.domain.groupmedical;

import com.moong.domain.entity.PetMedical;
import com.moong.domain.enums.Disease;
import com.moong.domain.pet.PetAge;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class DiseaseStatistics {

    private static final Comparator<DiseaseRatio> DISEASE_RATIO_COMPARATOR = Comparator.comparing(DiseaseRatio::getYear);

    private final List<DiseaseRatio> diseaseRatios;

    public DiseaseStatistics(List<PetMedical> petMedicals, PetAge petAge) {
        this.diseaseRatios = petMedicals.stream()
                .map(medical -> new DiseaseRatio(medical, petAge))
                .toList();
    }

    public List<Integer> findDiseaseRatioHistory(Disease disease) {
        return diseaseRatios.stream()
                .filter(diseaseRatio -> diseaseRatio.isDisease(disease))
                .sorted(DISEASE_RATIO_COMPARATOR)
                .map(DiseaseRatio::getRatio)
                .toList();
    }
}
