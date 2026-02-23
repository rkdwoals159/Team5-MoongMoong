package com.moong.controller;

import com.moong.domain.crew.Crew;
import com.moong.domain.member.Member;
import com.moong.domain.pet.Pet;
import com.moong.domain.petgroup.PetGroup;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import com.moong.dto.request.pet.PetCreateRequest;
import com.moong.dto.request.pet.PetUpdateRequest;
import com.moong.dto.response.pet.PetReadResponse;
import com.moong.dto.response.pet.PetUpdateResponse;
import com.moong.service.medicaladvice.PetMedicalAdviceService;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class PetControllerTest extends BaseControllerTest {

    @MockitoBean
    private PetMedicalAdviceService petMedicalAdviceService;

    @DisplayName("인증에 성공한 사용자가 강아지 정보 입력에 성공")
    @Test
    void savePetSuccess() {
        Member member = memberGenerator.generateSaved("softeer");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
        List<Disease> diseases = List.of(Disease.CAR, Disease.DER);
        PetCreateRequest petCreateRequest = new PetCreateRequest(
                "코코",
                Breed.BEA,
                Gender.F,
                YearMonth.of(2025, 5),
                "서울시",
                "중구",
                diseases
        );

        given().log().all()
                .contentType(ContentType.JSON)
                .body(petCreateRequest)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .post("/api/pet")
                .then()
                .statusCode(200);

        verify(petMedicalAdviceService, times(1))
                .createMedicalAdvice(anyLong(), anyLong(), any());
    }

    @DisplayName("강아지 정보 입력시 인증에 실패하면 401을 반환한다")
    @Test
    void savePetFail() {
        List<Disease> diseases = List.of(Disease.CAR, Disease.DER);
        PetCreateRequest petCreateRequest = new PetCreateRequest(
                "코코",
                Breed.BEA,
                Gender.F,
                YearMonth.of(2025, 5),
                "서울시",
                "중구",
                diseases
        );

        given().log().all()
                .contentType(ContentType.JSON)
                .body(petCreateRequest)
                .post("/api/pet")
                .then()
                .statusCode(401);
    }

    @DisplayName("인증에 성공한 사용자가 강아지 정보 조회에 성공")
    @Test
    void findPetInfoSuccess() {
        Member member = memberGenerator.generateSaved("softeer");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
        List<Disease> diseases = List.of(Disease.CAR, Disease.DER);
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        worriedDiseaseGenerator.generateSaved(diseases, pet);

        PetReadResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .get("/api/pet")
                .then()
                .statusCode(200)
                .extract()
                .as(PetReadResponse.class);

        LocalDate birthDate = pet.getBirthDate();
        int petBirthYear = birthDate.getYear();
        int petBirthMonth = birthDate.getMonthValue();

        assertAll(
                () -> assertThat(response.petId()).isEqualTo(pet.getId()),
                () -> assertThat(response.petName()).isEqualTo(pet.getName()),
                () -> assertThat(response.birthDate().getYear()).isEqualTo(petBirthYear),
                () -> assertThat(response.birthDate().getMonthValue()).isEqualTo(petBirthMonth),
                () -> assertThat(response.city()).isEqualTo(pet.getCity()),
                () -> assertThat(response.district()).isEqualTo(pet.getDistrict()),
                () -> assertThat(response.gender()).isEqualTo(pet.getGender()),
                () -> assertThat(response.diseases()).hasSize(diseases.size())
        );
    }

    @DisplayName("인증에 실패한 사용자가 강아지 정보 조회에 실패")
    @Test
    void findPetInfoFail() {
        List<Disease> diseases = List.of(Disease.CAR, Disease.DER);
        Pet pet = petGenerator.generateSaved();
        worriedDiseaseGenerator.generateSaved(diseases, pet);

        given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, "")
                .get("/api/pet")
                .then()
                .statusCode(401);
    }

    @DisplayName("펫 수정 성공")
    @Test
    void updatePetInfoSuccess() {
        Member member = memberGenerator.generateSaved("softeer");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
        List<Disease> diseases = List.of(Disease.CAR, Disease.DER);
        List<Disease> updatedDiseases = List.of(Disease.END, Disease.GAS);
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        worriedDiseaseGenerator.generateSaved(diseases, pet);
        PetUpdateRequest petUpdateRequest = new PetUpdateRequest(
                "쿠쿠",
                Breed.DAS,
                Gender.M,
                YearMonth.of(2025, 7),
                "서울시",
                "서초구",
                updatedDiseases
        );

        PetUpdateResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .body(petUpdateRequest)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + accessToken)
                .put("/api/pet")
                .then()
                .statusCode(200)
                .extract()
                .as(PetUpdateResponse.class);

        assertAll(
                () -> assertThat(response.petName()).isEqualTo(petUpdateRequest.petName()),
                () -> assertThat(response.breed()).isEqualTo(petUpdateRequest.breed()),
                () -> assertThat(response.gender()).isEqualTo(petUpdateRequest.gender()),
                () -> assertThat(response.birthDate())
                                .isEqualTo(YearMonth.from(petUpdateRequest.birthDate())),
                () -> assertThat(response.city()).isEqualTo(petUpdateRequest.city()),
                () -> assertThat(response.district()).isEqualTo(petUpdateRequest.district()),
                () -> assertThat(response.diseases()).hasSize(updatedDiseases.size()),
                () -> assertThat(response.diseases())
                        .containsExactlyInAnyOrderElementsOf(updatedDiseases)
        );
    }
}
