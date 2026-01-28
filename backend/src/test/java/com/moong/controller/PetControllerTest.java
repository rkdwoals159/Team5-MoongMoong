package com.moong.controller;

import com.moong.domain.entity.Member;
import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import com.moong.dto.request.PetCreateRequest;
import io.restassured.http.ContentType;
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
                .queryParam("auth", "true")
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
                .queryParam("auth", "true")
                .post("/api/pet")
                .then()
                .statusCode(401);
    }
}
