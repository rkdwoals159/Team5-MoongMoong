package com.moong.repository;

import com.moong.domain.entity.PetMedical;
import org.springframework.data.repository.Repository;

public interface PetMedicalTestRepository extends Repository<PetMedical, Long> {

    PetMedical save(PetMedical petMedical);
}
