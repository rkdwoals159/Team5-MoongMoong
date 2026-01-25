package com.moong.controller;

import io.restassured.http.ContentType;
import java.time.LocalDate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class MemberExpenseControllerTest extends BaseControllerTest {

    @DisplayName("기간 내의 개인 소비내역 반환 성공")
    @Test
    void getMemberExpensesByPeriodSuccess() {
        LocalDate startDate = LocalDate.of(2026, 1, 1);
        LocalDate endDate = LocalDate.of(2026, 1, 2);
        long memberId = 1L;

        given().log().all()
                .contentType(ContentType.JSON)
                .queryParam("memberId", memberId)
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
        long memberId = 1L;

        given().log().all()
                .contentType(ContentType.JSON)
                .queryParam("memberId", memberId)
                .queryParam("startDate", startDate.toString())
                .queryParam("endDate", endDate.toString())
                .get("/api/expenses")
                .then()
                .statusCode(400);
    }

}
