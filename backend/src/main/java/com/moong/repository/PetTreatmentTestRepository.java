package com.moong.repository;

import com.moong.domain.entity.Treatment;
import org.springframework.data.repository.Repository;

public interface PetTreatmentTestRepository extends Repository<Treatment, Long> {

    Treatment save(Treatment treatment);
}
