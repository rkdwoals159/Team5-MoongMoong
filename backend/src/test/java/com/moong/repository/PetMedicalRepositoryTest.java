package com.moong.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.petmedical.PetMedical;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import com.moong.repository.petmedical.PetMedicalRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

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

    @DisplayName("제외 : 해당 종, 성별, 나이 구간 내의 의료 예측 정보를 생성 기간을 필터링하여 가져온다")
    @Test
    void findByBreedAndGenderAndAgeBetweenWithCreatedAt_Except() {
        LocalDateTime createdAt = LocalDateTime.now();
        petMedicalGenerator.generateSaved(Breed.CHL, 3, Gender.F, Disease.CAR, 3);

        List<PetMedical> foundPetMedical = petMedicalRepository.findByBreedAndGenderAndAgeBetweenAndCreatedAtBetween(
                Breed.CHL,
                Gender.F,
                2,
                4,
                createdAt.minusSeconds(2),
                createdAt.minusSeconds(1)
        );

        assertThat(foundPetMedical).isEmpty();
    }

    @DisplayName("포함 : 해당 종, 성별, 나이 구간 내의 의료 예측 정보를 생성 기간을 필터링하여 가져온다")
    @Test
    void findByBreedAndGenderAndAgeBetweenWithCreatedAt_Include() {
        LocalDateTime createdAt = LocalDateTime.now();
        //검색 범위 제외 나이
        petMedicalGenerator.generateSaved(Breed.CHL, 3, Gender.F, Disease.CAR, 3);

        List<PetMedical> foundPetMedical = petMedicalRepository.findByBreedAndGenderAndAgeBetweenAndCreatedAtBetween(
                Breed.CHL,
                Gender.F,
                2,
                4,
                createdAt,
                createdAt.plusSeconds(1)
        );

        assertThat(foundPetMedical).hasSize(1);
    }


    @DisplayName("제외 : 해당 종, 성별, 나이의 의료 예측 정보를 생성 기간을 필터링하여 가져온다")
    @Test
    void findByBreedAndGenderAndAgeWithCreatedAt_Except() {
        LocalDateTime createdAt = LocalDateTime.now();
        petMedicalGenerator.generateSaved(Breed.CHL, 3, Gender.F, Disease.CAR, 3);

        List<PetMedical> foundPetMedical = petMedicalRepository.findMedicalByBreedAndAgeAndGenderAndCreatedAtBetween(
                Breed.CHL,
                3,
                Gender.F,
                createdAt.minusSeconds(2),
                createdAt.minusSeconds(1)
        );

        assertThat(foundPetMedical).isEmpty();
    }

    @DisplayName("포함 : 해당 종, 성별, 나이 구간 내의 의료 예측 정보를 생성 기간을 필터링하여 가져온다")
    @Test
    void findByBreedAndGenderAndAgeWithCreatedAt_Include() {
        LocalDateTime createdAt = LocalDateTime.now();
        petMedicalGenerator.generateSaved(Breed.CHL, 3, Gender.F, Disease.CAR, 3);

        List<PetMedical> foundPetMedical = petMedicalRepository.findMedicalByBreedAndAgeAndGenderAndCreatedAtBetween(
                Breed.CHL,
                3,
                Gender.F,
                createdAt,
                createdAt.plusSeconds(1)
        );

        assertThat(foundPetMedical).hasSize(1);
    }

    @DisplayName("최신 생성 데이터의 날짜를 조회한다")
    @Test
    void findLatestDate() {
        petMedicalGenerator.generateSaved(Breed.CHL, 3, Gender.F, Disease.CAR, 3);
        LocalDate createdDate = LocalDate.now();

        LocalDate actual = petMedicalRepository.findLatestCreatedDate().get()
                .toLocalDate();

        assertThat(actual).isEqualTo(createdDate);
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
                .findTopRatioPetMedical(
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
