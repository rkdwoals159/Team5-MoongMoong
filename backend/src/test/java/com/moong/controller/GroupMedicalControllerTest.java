package com.moong.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.entity.PetMedical;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import com.moong.domain.pet.PetAge;
import com.moong.dto.response.groupmedical.GroupMedicalStatisticsResponse;
import com.moong.dto.response.groupmedical.PetDiseaseRankingResponse;
import io.restassured.http.ContentType;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;

class GroupMedicalControllerTest extends BaseControllerTest {

    @DisplayName("그룹 의사 권장사항 반환 성공")
    @Test
    void getGroupMedicalInfoSuccess() {
        Member member = memberGenerator.generateSaved("softeer");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        groupMedicalAdviceGenerator.generateSaved(petGroup);

        given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .get("/api/group/medical/info")
                .then()
                .statusCode(200);
    }

    @DisplayName("그룹 의사 권장사항 반환 실패 : 인증에 실패하여 401을 반환")
    @Test
    void getMemberExpensesByPeriodFail() {
        given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, "")
                .get("/api/group/medical/info")
                .then()
                .statusCode(401);
    }

    @DisplayName("특정 질병의 의료비 데이터 리스트 반환 성공")
    @Test
    void getTreatmentSuccess() {
        Member member = memberGenerator.generateSaved("softeer");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
        Pet pet = petGenerator.generateSaved("서울시", "중구");
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        treatmentGenerator.generateSaved(Disease.DER, "피부염", pet.getCity(), pet.getDistrict());
        treatmentGenerator.generateSaved(Disease.DER, "항생제 처방", pet.getCity(), pet.getDistrict());

        given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .queryParam("disease", "DER")
                .get("/api/group/medical/disease/cost")
                .then()
                .statusCode(200);
    }

    @DisplayName("향후 7년간 질병 위험도를 조회할 수 있다")
    @Test
    void findGroupMedicalStatistics() {
        Member member = memberGenerator.generateSaved("softeer");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
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

        GroupMedicalStatisticsResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .queryParam("disease", "DER")
                .get("/api/group/medical/statistics")
                .then()
                .statusCode(200)
                .extract()
                .as(GroupMedicalStatisticsResponse.class);

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

    @DisplayName("사용자의 펫 데이터를 통해 가장 주의해야할 질병부터 순서대로 반환합니다.")
    @Test
    void findPetDiseaseRanking() {
        Member member = memberGenerator.generateSaved("softeer");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
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

        PetDiseaseRankingResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .get("/api/group/medical/disease")
                .then()
                .statusCode(200)
                .extract().as(PetDiseaseRankingResponse.class);

        assertAll(
                () -> assertThat(response.diseases()).hasSize(diseases.size()),
                () -> assertThat(response.diseases())
                        .containsExactlyElementsOf(diseases)
        );
    }
}
