package com.moong.fixture;

import com.moong.domain.entity.PetMedical;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import com.moong.repository.PetMedicalRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import org.springframework.stereotype.Component;

@Component
public class PetMedicalGenerator {

    private final PetMedicalRepository petMedicalRepository;

    public PetMedicalGenerator(PetMedicalRepository petMedicalRepository) {
        this.petMedicalRepository = petMedicalRepository;
    }

    public PetMedical generateSaved(
            Breed breed,
            int age,
            Gender gender,
            Disease disease,
            int ratio
    ) {
        PetMedical petMedical = new PetMedical(null, breed, age, gender, disease, ratio);
        return petMedicalRepository.save(petMedical);
    }

    public List<PetMedical> generateSavePetMedicals(Breed breed, int age, Gender gender) {
        List<PetMedical> petMedicals = new ArrayList<>();
        for (Disease disease: Disease.values()) {
            PetMedical petMedical = generateSaved(breed, age, gender, disease, new Random().nextInt(101));
            petMedicals.add(petMedical);
        }
        return petMedicals;
    }
}
