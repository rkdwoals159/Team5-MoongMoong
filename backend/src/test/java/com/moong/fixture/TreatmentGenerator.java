package com.moong.fixture;

import com.moong.domain.treatment.Treatment;
import com.moong.domain.enums.Disease;
import com.moong.repository.treatment.TreatmentRepository;
import org.springframework.stereotype.Component;

@Component
public class TreatmentGenerator {
    private final TreatmentRepository treatmentRepository;

    public TreatmentGenerator(TreatmentRepository treatmentRepository) {
        this.treatmentRepository = treatmentRepository;
    }

    public Treatment generateSaved(Disease disease, String name, String city, String district) {
        Treatment treatment = new Treatment(
                null,
                disease,
                name,
                "피부 트러블 등",
                city,
                district,
                45000,
                120000,
                68000);

        return treatmentRepository.save(treatment);
    }

    public Treatment generatedSaved(Disease disease, String name, int minPrice, int averagePrice, int maxPrice){
        Treatment treatment = new Treatment(
                null,
                disease,
                name,
                "",
                "서울시",
                "중구",
                minPrice,
                averagePrice,
                maxPrice
        );
        return treatmentRepository.save(treatment);
    }
}
