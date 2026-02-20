package com.moong.repository.petmedical;

import com.moong.domain.entity.PetMedical;
import java.util.List;

public interface PetMedicalJdbcRepository {

    void saveAllByBulkQuery(List<PetMedical> petMedicals);
}
