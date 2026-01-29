package com.moong.controller;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.request.bank.BankCreateRequest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;

class BankControllerTest extends BaseControllerTest {

    @DisplayName("저금통 생성 성공")
    @Test
    void createBankSuccess() {
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);

        BankCreateRequest bankCreateRequest = new BankCreateRequest(150000L);

        given().log().all()
                .contentType(ContentType.JSON)
                .body(bankCreateRequest)
                .header(HttpHeaders.AUTHORIZATION, member.getId())
                .post("/api/group/bank")
                .then()
                .statusCode(200);
    }
}
