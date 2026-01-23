package com.moong.fixture;

import com.moong.domain.entity.Pet;
import com.moong.domain.entity.WorriedDisease;
import com.moong.domain.enums.Disease;
import com.moong.repository.WorriedDiseaseRepository;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class WorriedDiseaseGenerator {

    private final WorriedDiseaseRepository worriedDiseaseRepository;

    public WorriedDiseaseGenerator(WorriedDiseaseRepository worriedDiseaseRepository) {
        this.worriedDiseaseRepository = worriedDiseaseRepository;
    }

    public List<WorriedDisease> generateUnSaved(List<Disease> worriedDisease, Pet pet) {
        return worriedDisease.stream()
                .map(disease -> new WorriedDisease(disease, pet))
                .toList();
    }
}
