package com.moong.repository;

import com.moong.domain.entity.PetMedical;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

class PetMedicalRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private PetMedicalRepository petMedicalRepository;


    @DisplayName("해당 종, 성별을 지닌 강아지의 기간 내 의료 예측 정보를 가져온다")
    @Test
    void findByBreedAndGenderAndAgeBetween() {
        //검색 범위 제외 나이
        PetMedical chiFMedical0 = petMedicalGenerator.generateSaved(
                Breed.CHL, 3, Gender.F, Disease.CAR, 3
        );

        //다른 성별
        PetMedical beaMMedical3 = petMedicalGenerator.generateSaved(
                Breed.BEA, 3, Gender.M, Disease.CAR, 3
        );

        PetMedical beaFMedical3 = petMedicalGenerator.generateSaved(
                Breed.BEA, 3, Gender.F, Disease.CAR, 3
        );

        List<PetMedical> foundPetMedical = petMedicalRepository.findByBreedAndGenderAndAgeBetween(
                Breed.BEA,
                Gender.F,
                2,
                4
        );

        assertThat(foundPetMedical)
                .containsExactly(beaFMedical3);
    }

    @DisplayName("해당 종, 나이, 성별 중 발병 확률 ratio가 가장 높은 의료 정보를 반환한다")
    @Test
    void findTopByBreedAndAgeAndGenderOrderByRatioDesc() {
        // given
        petMedicalGenerator.generateSaved(Breed.CHL, 5, Gender.F, Disease.CAR, 10);
        petMedicalGenerator.generateSaved(Breed.BEA, 5, Gender.M, Disease.CAR, 90);

        petMedicalGenerator.generateSaved(Breed.BEA, 5, Gender.F, Disease.CAR, 20);
        petMedicalGenerator.generateSaved(Breed.BEA, 5, Gender.F, Disease.DER, 50);
        petMedicalGenerator.generateSaved(Breed.BEA, 5, Gender.F, Disease.GAS, 80);

        // when
        PetMedical found = petMedicalRepository
                .findTopByBreedAndAgeAndGenderOrderByRatioDesc(
                        Breed.BEA,
                        5,
                        Gender.F
                );

        // then
        assertAll(
                () -> assertThat(found.getRatio()).isEqualTo(80),
                () -> assertThat(found.getDisease()).isEqualTo(Disease.GAS)
        );
    }
}
