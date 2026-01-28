package com.moong.repository;

import com.moong.domain.entity.PetMedical;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Gender;
import java.util.List;
import org.springframework.data.repository.Repository;

public interface PetMedicalRepository extends Repository<PetMedical, Long> {

    PetMedical save(PetMedical petMedical);

    List<PetMedical> findByBreedAndAgeAndGender(Breed breed, int age, Gender gender);
}
