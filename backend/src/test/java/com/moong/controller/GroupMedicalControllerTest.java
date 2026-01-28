package com.moong.controller;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.enums.Disease;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class GroupMedicalControllerTest extends BaseControllerTest {

    @DisplayName("그룹 의사 권장사항 반환 성공")
    @Test
    void getGroupMedicalInfoSuccess() {
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        groupMedicalAdviceGenerator.generateSaved(petGroup);

        given().log().all()
                .contentType(ContentType.JSON)
                .queryParam("memberId", member.getId())
                .queryParam("auth", "true")
                .get("/api/group/medical/info")
                .then()
                .statusCode(200);
    }

    @DisplayName("그룹 의사 권장사항 반환 실패 : 인증에 실패하여 401을 반환")
    @Test
    void getMemberExpensesByPeriodFail() {
        long memberId = 1L;

        given().log().all()
                .contentType(ContentType.JSON)
                .queryParam("memberId", memberId)
                .queryParam("auth", "true")
                .get("/api/group/medical/info")
                .then()
                .statusCode(401);
    }

    @DisplayName("특정 질병의 의료비 데이터 리스트 반환 성공")
    @Test
    void getTreatmentSuccess() {
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved("서울시", "중구");
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        treatmentGenerator.generateSaved(Disease.DER, "피부염", pet.getCity(), pet.getDistrict());
        treatmentGenerator.generateSaved(Disease.DER, "항생제 처방", pet.getCity(), pet.getDistrict());

        given().log().all()
                .contentType(ContentType.JSON)
                .queryParam("memberId", member.getId())
                .queryParam("auth", "true")
                .queryParam("disease", "DER")
                .get("/api/group/medical/disease/cost")
                .then()
                .statusCode(200);
    }
}
