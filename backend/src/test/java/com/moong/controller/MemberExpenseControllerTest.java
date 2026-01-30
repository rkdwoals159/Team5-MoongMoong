package com.moong.controller;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.dto.request.memberexpense.MemberExpenseUpsertRequest;
import com.moong.dto.request.memberexpense.MemberExpensesUpsertRequest;
import com.moong.dto.response.memberexpense.MemberExpensesUpsertResponse;
import io.restassured.http.ContentType;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;

class MemberExpenseControllerTest extends BaseControllerTest {

    @DisplayName("기간 내의 개인 소비내역 반환 성공")
    @Test
    void getMemberExpensesByPeriodSuccess() {
        LocalDate startDate = LocalDate.of(2026, 1, 1);
        LocalDate endDate = LocalDate.of(2026, 1, 2);
        Member member = memberGenerator.generateSaved("멤버1");

        given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, member.getId())
                .queryParam("startDate", startDate.toString())
                .queryParam("endDate", endDate.toString())
                .get("/api/expenses")
                .then()
                .statusCode(200);
    }

    @DisplayName("기간내 소비내역 반환 실패 : 시작일보다 빠른 종료일")
    @Test
    void getMemberExpensesByPeriodFail() {
        LocalDate startDate = LocalDate.of(2026, 1, 3);
        LocalDate endDate = LocalDate.of(2026, 1, 2);
        Member member = memberGenerator.generateSaved("멤버1");

        given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, member.getId())
                .queryParam("startDate", startDate.toString())
                .queryParam("endDate", endDate.toString())
                .get("/api/expenses")
                .then()
                .statusCode(400);
    }

    @DisplayName("소비내역 생성, 수정, 삭제 요청을 성공한다")
    @Test
    void upsertMemberExpenses() {
        Member member = memberGenerator.generateSaved("멤버1");
        List<MemberExpense> memberExpenses = memberExpenseGenerator.generatedListSaved(member);
        MemberExpense updateTarget = memberExpenses.get(0);
        List<MemberExpense> deleteTargets = memberExpenses.subList(1, memberExpenses.size());
        List<Long> deletedIds = deleteTargets.stream()
                .map(MemberExpense::getId)
                .toList();

        List<MemberExpenseUpsertRequest> upsertRequests = List.of(
                new MemberExpenseUpsertRequest(
                        false,
                        updateTarget.getId(),
                        LocalDate.of(2026, 1, 10),
                        "사료(대용량)",
                        45000,
                        "식비",
                        "사료",
                        "10kg 대용량 구매"
                ),
                new MemberExpenseUpsertRequest(
                        true,
                        null,
                        LocalDate.of(2026, 1, 5),
                        "미용",
                        70000,
                        "미용비",
                        "미용",
                        "털 정리"
                )
        );

        MemberExpensesUpsertRequest request = new MemberExpensesUpsertRequest(
                upsertRequests,
                deletedIds
        );

        MemberExpensesUpsertResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, member.getId())
                .body(request)
                .patch("/api/expenses")
                .then()
                .statusCode(200)
                .extract().as(MemberExpensesUpsertResponse.class);

        assertThat(response.expenses()).hasSize(upsertRequests.size());
    }
}
