package com.moong.repository.petmedical;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.entity.PetMedical;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import com.moong.repository.BaseRepositoryTest;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class PetMedicalJdbcRepositoryImplTest extends BaseRepositoryTest {

    @Autowired
    private PetMedicalRepository petMedicalRepository;

    @DisplayName("전달 받은 펫 의료정보를 bulk 쿼리로 삽입한다")
    @Test
    void saveAllByBulkQuery() {
        PetMedical petMedical1 = new PetMedical(
                null,
                Breed.BEA,
                10,
                Gender.F,
                Disease.CAR,
                30
        );
        PetMedical petMedical2 = new PetMedical(
                null,
                Breed.BEA,
                11,
                Gender.F,
                Disease.CAR,
                30
        );
        PetMedical petMedical3 = new PetMedical(
                null,
                Breed.BEA,
                12,
                Gender.F,
                Disease.CAR,
                30
        );

        petMedicalRepository.saveAllByBulkQuery(List.of(petMedical1, petMedical2, petMedical3));

        List<PetMedical> petMedicals = petMedicalRepository.findByBreedAndGenderAndAgeBetween(Breed.BEA, Gender.F, 0,
                20);
        assertThat(petMedicals.size()).isEqualTo(3);
    }
}
