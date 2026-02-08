package com.moong.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import com.moong.domain.entity.GroupExpense;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.response.groupexpense.CategoryAnalysisResponse;
import com.moong.dto.response.groupexpense.GroupExpensesDailyResponse;
import com.moong.dto.response.groupexpense.GroupExpensesResponse;
import com.moong.dto.response.groupexpense.MedicalCategoryAnalysisResponse;
import io.restassured.http.ContentType;
import java.time.LocalDateTime;
import org.apache.http.HttpHeaders;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class GroupExpenseControllerTest extends BaseControllerTest {

    @DisplayName("기간 내의 그룹 소비 내역을 찾을 수 있다")
    @Test
    void findGroupExpenseByPeriod() {
        LocalDateTime now = LocalDateTime.now();
        Member coli = memberGenerator.generateSaved("coli");
        String accessToken = jwtTokenGenerator.generateAccessToken(coli);
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, coli);

        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.minusDays(2L).toLocalDate(),
                "류몽민 닭갈비",
                100,
                "식비",
                "소분류",
                "메모",
                now.minusDays(2L),
                coli
        );
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(
                now.minusDays(1L).toLocalDate(),
                "항아리 수제비",
                200,
                "식비",
                "소분류",
                "메모",
                now.minusDays(1L),
                coli
        );
        MemberExpense memberExpense3 = memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "우럭 회",
                300,
                "식비",
                "소분류",
                "메모",
                now,
                coli
        );

        groupExpenseGenerator.generateSaved(petGroup, memberExpense1, coli.getName());
        groupExpenseGenerator.generateSaved(petGroup, memberExpense2, coli.getName());
        groupExpenseGenerator.generateSaved(petGroup, memberExpense3, coli.getName());

        GroupExpensesResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .queryParam("startDate", now.minusDays(2).toLocalDate().toString())
                .queryParam("endDate", now.minusDays(1).toLocalDate().toString())
                .get("/api/expenses/group")
                .then()
                .statusCode(200)
                .extract()
                .as(GroupExpensesResponse.class);

        assertAll(
                () -> assertThat(response.total()).isEqualTo(300),
                () -> assertThat(response.expenses()).hasSize(2)
        );
    }

    @DisplayName("기간 내의 그룹 소비 내역의 카테고리별 분석 내역을 찾을 수 있다")
    @Test
    void findGroupExpenseCategoryAnalysisByPeriod() {
        LocalDateTime now = LocalDateTime.now();
        Member coli = memberGenerator.generateSaved("coli");
        String accessToken = jwtTokenGenerator.generateAccessToken(coli);
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, coli);

        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.minusDays(2L).toLocalDate(),
                "류몽민 닭갈비",
                100,
                "식비",
                "소분류",
                "메모",
                now.minusDays(2L),
                coli
        );

        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(
                now.minusDays(1L).toLocalDate(),
                "수건구입",
                200,
                "생필품",
                "소분류",
                "메모",
                now.minusDays(1L),
                coli
        );

        GroupExpense groupExpense1 = groupExpenseGenerator.generateSaved(petGroup, memberExpense1, coli.getName());
        GroupExpense groupExpense2 = groupExpenseGenerator.generateSaved(petGroup, memberExpense2, coli.getName());

        CategoryAnalysisResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .queryParam("startDate", now.minusDays(2).toLocalDate().toString())
                .queryParam("endDate", now.minusDays(1).toLocalDate().toString())
                .get("/api/expenses/group/analysis/category")
                .then()
                .statusCode(200)
                .extract()
                .as(CategoryAnalysisResponse.class);

        assertAll(
                () -> assertThat(response.total()).isEqualTo(300),
                () -> assertThat(response.categoryAnalysis()).hasSize(2),
                () -> assertThat(response.categoryAnalysis().get(0).category()).isEqualTo(
                        groupExpense2.getMemberExpense().getMainCategory()),
                () -> assertThat(response.categoryAnalysis().get(0).cost()).isEqualTo(
                        groupExpense2.getMemberExpense().getCost()),
                () -> assertThat(response.categoryAnalysis().get(1).category()).isEqualTo(
                        groupExpense1.getMemberExpense().getMainCategory()),
                () -> assertThat(response.categoryAnalysis().get(1).cost()).isEqualTo(
                        groupExpense1.getMemberExpense().getCost())
        );
    }

    @DisplayName("기한 내의 의료비 소비내역의 소분류별 분석 기록을 조회할 수 있다")
    @Test
    void findMedicalCategoryAnalysis() {
        LocalDateTime now = LocalDateTime.now();
        Member coli = memberGenerator.generateSaved("coli");
        String accessToken = jwtTokenGenerator.generateAccessToken(coli);
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, coli);

        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.minusDays(2L).toLocalDate(),
                "뚱이 수술",
                100,
                "의료",
                "수술비",
                "메모",
                now.minusDays(2L),
                coli
        );
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(
                now.minusDays(1L).toLocalDate(),
                "뚱이 약",
                200,
                "의료",
                "약/처방",
                "메모",
                now.minusDays(1L),
                coli
        );
        GroupExpense groupExpense1 = groupExpenseGenerator.generateSaved(petGroup, memberExpense1, coli.getName());
        GroupExpense groupExpense2 = groupExpenseGenerator.generateSaved(petGroup, memberExpense2, coli.getName());

        MedicalCategoryAnalysisResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .queryParam("startDate", now.minusDays(2).toLocalDate().toString())
                .queryParam("endDate", now.minusDays(1).toLocalDate().toString())
                .get("/api/expenses/group/analysis/medical")
                .then()
                .statusCode(200)
                .extract()
                .as(MedicalCategoryAnalysisResponse.class);

        assertAll(
                () -> assertThat(response.totalMedical()).isEqualTo(300),
                () -> assertThat(response.medicalAnalysis()).hasSize(2),
                () -> assertThat(response.medicalAnalysis().get(0).subCategory()).isEqualTo(
                        groupExpense2.getMemberExpense().getSubCategory()),
                () -> assertThat(response.medicalAnalysis().get(0).cost()).isEqualTo(
                        groupExpense2.getMemberExpense().getCost()),
                () -> assertThat(response.medicalAnalysis().get(1).subCategory()).isEqualTo(
                        groupExpense1.getMemberExpense().getSubCategory()),
                () -> assertThat(response.medicalAnalysis().get(1).cost()).isEqualTo(
                        groupExpense1.getMemberExpense().getCost())
        );
    }

    @DisplayName("특정 날짜의 그룹 소비 내역을 조회할 수 있다.")
    @Test
    void findBySpentAt() {
        LocalDateTime now = LocalDateTime.now();
        Member member = memberGenerator.generateSaved("softeer");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "류몽민 닭갈비",
                100,
                "식비",
                "소분류",
                "메모",
                now.minusDays(2L),
                member
        );
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "수건 구입",
                200,
                "생필품",
                "소분류",
                "메모",
                now.minusDays(1L),
                member
        );
        GroupExpense groupExpense1 = groupExpenseGenerator.generateSaved(petGroup, memberExpense1, member.getName());
        GroupExpense groupExpense2 = groupExpenseGenerator.generateSaved(petGroup, memberExpense2, member.getName());

        GroupExpensesDailyResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .queryParam("spentAt", now.toLocalDate().toString())
                .get("/api/expenses/group/date")
                .then()
                .statusCode(200)
                .extract()
                .as(GroupExpensesDailyResponse.class);

        assertAll(
                () -> assertThat(response.total()).isEqualTo(300),
                () -> assertThat(response.expenses()).hasSize(2),
                () -> assertThat(response.expenses().get(0).mainCategory()).isEqualTo(
                        groupExpense2.getMemberExpense().getMainCategory()),
                () -> assertThat(response.expenses().get(0).cost()).isEqualTo(
                        groupExpense2.getMemberExpense().getCost()),
                () -> assertThat(response.expenses().get(1).mainCategory()).isEqualTo(
                        groupExpense1.getMemberExpense().getMainCategory()),
                () -> assertThat(response.expenses().get(1).cost()).isEqualTo(
                        groupExpense1.getMemberExpense().getCost())
        );
    }
}
