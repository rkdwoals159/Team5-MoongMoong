package com.moong.repository.petmedical;

import com.moong.domain.petmedical.PetMedical;
import java.util.List;

public interface PetMedicalJdbcRepository {

    void saveAllByBulkQuery(List<PetMedical> petMedicals);
}
