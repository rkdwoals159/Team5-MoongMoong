package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.groupmedical.GroupMedicalAdvice;
import com.moong.domain.member.Member;
import com.moong.domain.pet.Pet;
import com.moong.domain.petgroup.PetGroup;
import com.moong.domain.petmedical.PetMedical;
import com.moong.domain.treatment.Treatment;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import com.moong.domain.pet.PetAge;
import com.moong.dto.response.petmedical.PetMedicalInfoResponse;
import com.moong.dto.response.petmedical.PetMedicalStatisticsResponse;
import com.moong.dto.response.petmedical.PetDiseaseRankingResponse;
import com.moong.dto.response.treatment.TreatmentResponse;
import com.moong.dto.response.treatment.TreatmentsResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.service.petmedical.PetMedicalService;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class PetMedicalServiceTest extends BaseServiceTest {

    @Autowired
    private PetMedicalService petMedicalService;

    @DisplayName("그룹 의사 권장사항을 조회할 수 있다")
    @Test
    void getGroupMedicalInfo() {
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        GroupMedicalAdvice groupMedicalAdvice = groupMedicalAdviceGenerator.generateSaved(petGroup);

        PetMedicalInfoResponse response = petMedicalService.getGroupMedicalInfo(member);

        assertAll(
                () -> assertThat(response.advice()).isEqualTo(groupMedicalAdvice.getAdvice()),
                () -> assertThat(response.expectedCost()).isEqualTo(groupMedicalAdvice.getExpectedCost()),
                () -> assertThat(response.year()).isEqualTo(groupMedicalAdvice.getYear())
        );
    }

    @DisplayName("향후 7년간 질병 위험도를 조회할 수 있다")
    @Test
    void findGroupMedicalStatistics() {
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved(Breed.BEA, Gender.F, LocalDate.now().minusYears(3L));
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        //검색 범위 제외 나이
        PetMedical chiFMedical0 = petMedicalGenerator.generateSaved(
                Breed.CHL, 0, Gender.F, Disease.CAR, 3
        );

        //다른 성별
        PetMedical beaMMedical3 = petMedicalGenerator.generateSaved(
                Breed.BEA, 3, Gender.M, Disease.CAR, 3
        );

        PetMedical beaFMedical3 = petMedicalGenerator.generateSaved(
                Breed.BEA, 3, Gender.F, Disease.CAR, 3
        );

        PetMedicalStatisticsResponse response = petMedicalService.findGroupMedicalStatistics(member);
        List<Integer> carRatio = response.statistics().stream()
                .filter(statistic -> statistic.disease().isSame(Disease.CAR))
                .findAny()
                .get()
                .ratios();

        assertAll(
                () -> assertThat(response.startYear()).isEqualTo(LocalDate.now().getYear()),
                () -> assertThat(carRatio).containsExactly(beaFMedical3.getRatio())
        );
    }

    @DisplayName("특정 질병의 의료비 데이터를 조회할 수 있다")
    @Test
    void getTreatment() {
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved("서울시", "중구");
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        Treatment treatment = treatmentGenerator.generateSaved(Disease.DER, "피부염", "서울시", "중구");

        TreatmentsResponse response = petMedicalService.getTreatment(member, Disease.DER);
        TreatmentResponse treatmentResponse = response.treatments().get(0);

        assertAll(
                () -> assertThat(treatmentResponse.name()).isEqualTo(treatment.getName()),
                () -> assertThat(treatmentResponse.description()).isEqualTo(treatment.getDescription()),
                () -> assertThat(treatmentResponse.minPrice()).isEqualTo(treatment.getMinPrice()),
                () -> assertThat(treatmentResponse.maxPrice()).isEqualTo(treatment.getMaxPrice()),
                () -> assertThat(treatmentResponse.averagePrice()).isEqualTo(treatment.getAveragePrice())
        );
    }

    @DisplayName("사용자의 펫 데이터를 통해 가장 주의해야할 질병부터 순서대로 반환합니다.")
    @Test
    void findPetDiseaseRanking() {
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        PetAge petAge = new PetAge(pet.getBirthDate());
        crewGenerator.generateSaved(petGroup, member);
        List<PetMedical> petMedicals = petMedicalGenerator.generateSavePetMedicals(
                pet.getBreed(),
                petAge.getValue(),
                pet.getGender()
        );
        List<Disease> diseases = petMedicals.stream()
                .sorted(Comparator.comparing(PetMedical::getRatio).reversed())
                .map(PetMedical::getDisease)
                .toList();

        PetDiseaseRankingResponse response = petMedicalService.findPetDiseaseRanking(member);

        assertAll(
                () -> assertThat(response.diseases()).hasSize(diseases.size()),
                () -> assertThat(response.diseases())
                        .containsExactlyElementsOf(diseases)
        );
    }

    @DisplayName("사용자의 펫이 의료데이터를 제공하는 최대 나이를 초과하면 최대 나이 기준 데이터를 반환합니다")
    @Test
    void findOldestPetMedicalWhenAgeExceed() {
        int maxAge = 20;
        LocalDate oldPetBirthDate = LocalDate.now().minusYears(maxAge +1);
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved(Breed.BEA, Gender.F, oldPetBirthDate);
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        List<PetMedical> petMedicals = petMedicalGenerator.generateSavePetMedicals(
                pet.getBreed(),
                maxAge,
                pet.getGender()
        );
        List<Disease> diseases = petMedicals.stream()
                .sorted(Comparator.comparing(PetMedical::getRatio).reversed())
                .map(PetMedical::getDisease)
                .toList();

        PetDiseaseRankingResponse response = petMedicalService.findPetDiseaseRanking(member);

        assertAll(
                () -> assertThat(response.diseases()).hasSize(diseases.size()),
                () -> assertThat(response.diseases())
                        .containsExactlyElementsOf(diseases)
        );
    }

    @DisplayName("종·성별·나이 기준 질병 데이터 개수가 불일치하면 예외를 던진다")
    @Test
    void findPetDiseaseRanking_failure_misMatch_disease_size() {
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved();
        PetAge petAge = new PetAge(pet.getBirthDate());
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);

        petMedicalGenerator.generateSavePetMedicals(
                pet.getBreed(),
                petAge.getValue(),
                pet.getGender()
        );
        petMedicalGenerator.generateSaved(
                pet.getBreed(),
                petAge.getValue(),
                pet.getGender(),
                Disease.CAR,
                50
        );

        assertThatThrownBy(() -> {
            petMedicalService.findPetDiseaseRanking(member);
        })
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.INCONSISTENT_DISEASE_DATA.getMessage());
    }

    @DisplayName("거주 지역에 특정 질병의 의료비 데이터가 존재하지 않을 경우 빈 배열을 반환한다")
    @Test
    void getTreatment_noTreatmentInRegion() {
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved("서울시", "중구");
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        treatmentGenerator.generateSaved(Disease.DER, "피부염", "서울시", "영등포구");

        TreatmentsResponse response = petMedicalService.getTreatment(member, Disease.DER);

        assertThat(response.treatments()).isEmpty();
    }
}
