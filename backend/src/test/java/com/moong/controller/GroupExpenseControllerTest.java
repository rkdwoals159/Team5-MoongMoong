package com.moong.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.response.groupexpense.GroupExpensesResponse;
import io.restassured.http.ContentType;
import java.time.LocalDateTime;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class GroupExpenseControllerTest extends BaseControllerTest {

    @DisplayName("기간 내의 그룹 소비 내역을 찾을 수 있다")
    @Test
    void findGroupExpenseByPeriod() {
        LocalDateTime now = LocalDateTime.now();
        Member coli = memberGenerator.generateSaved("coli");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, coli);

        //TODO generator 사용
        MemberExpense memberExpense1 = new MemberExpense(
                1L,
                now.minusDays(2L).toLocalDate(),
                "류몽민 닭갈비",
                100,
                "식비",
                "소분류",
                "메모",
                now.minusDays(2L),
                coli
        );
        MemberExpense memberExpense2 = new MemberExpense(
                1L,
                now.minusDays(1L).toLocalDate(),
                "항아리 수제비",
                200,
                "식비",
                "소분류",
                "메모",
                now.minusDays(1L),
                coli
        );
        MemberExpense memberExpense3 = new MemberExpense(
                1L,
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
                .queryParam("memberId", coli.getId())
                .queryParam("startDate", now.minusDays(2).toLocalDate().toString())
                .queryParam("endDate", now.minusDays(1).toLocalDate().toString())
                .queryParam("auth", "true")
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
}
