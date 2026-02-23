package com.moong.repository.treatment;

import com.moong.domain.treatment.Treatment;
import com.moong.domain.enums.Disease;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TreatmentRepository extends Repository<Treatment, Long> {

    Treatment save(Treatment treatment);

    List<Treatment> findByDiseaseAndCityAndDistrict(
            @Param("disease") Disease disease,
            @Param("city") String city,
            @Param("district") String district
    );
}
