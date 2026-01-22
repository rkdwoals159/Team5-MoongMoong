package com.moong.controller;

import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import com.moong.dto.request.PetCreateRequest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

class PetControllerTest extends BaseControllerTest {

    @Test
    void savePet() {
        List<Disease> diseases = List.of(Disease.CAR, Disease.DER);
        PetCreateRequest petCreateRequest = new PetCreateRequest(
                "코코",
                Breed.BEA,
                Gender.F,
                LocalDate.of(2025, 5, 29),
                "서울시",
                "중구",
                diseases
        );

        long memberId = 2L;

        given().log().all()
                .contentType(ContentType.JSON)
                .body(petCreateRequest)
                .queryParam("memberId", memberId)
                .post("/api/pet")
                .then()
                .statusCode(200);
    }
}
