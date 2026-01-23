package com.moong.fixture;

import com.moong.domain.entity.Pet;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Gender;
import com.moong.repository.PetRepository;
import java.time.LocalDate;
import org.springframework.stereotype.Component;

@Component
public class PetFixtureGenerator {

    private final PetRepository petRepository;

    public PetFixtureGenerator(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public Pet generateSaved() {
        return petRepository.save(generateUnSaved());
    }

    public Pet generateUnSaved() {
        return new Pet(null, "코코", Breed.BEA, Gender.F, LocalDate.of(2025, 5, 29), "서울시", "중구");
    }
}
