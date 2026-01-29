package com.moong.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import com.moong.dto.request.PetCreateRequest;
import com.moong.dto.response.pet.PetReadResponse;
import io.restassured.http.ContentType;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;

class PetControllerTest extends BaseControllerTest {

    @DisplayName("인증에 성공한 사용자가 강아지 정보 입력에 성공")
    @Test
    void savePetSuccess() {
        Member member = memberGenerator.generateSaved("softeer");
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
                .header(HttpHeaders.AUTHORIZATION, member.getId())
                .post("/api/pet")
                .then()
                .statusCode(200);
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
                .queryParam("memberId", 1L)
                .post("/api/pet")
                .then()
                .statusCode(401);
    }

    @DisplayName("인증에 성공한 사용자가 강아지 정보 조회에 성공")
    @Test
    void findPetInfoSuccess() {
        Member member = memberGenerator.generateSaved("softeer");
        List<Disease> diseases = List.of(Disease.CAR, Disease.DER);
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        Crew crew = crewGenerator.generateSaved(petGroup, member);
        worriedDiseaseGenerator.generateSaved(diseases, pet);

        PetReadResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, member.getId())
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
                .header(HttpHeaders.AUTHORIZATION, 1L)
                .get("/api/pet")
                .then()
                .statusCode(401);
    }
}
