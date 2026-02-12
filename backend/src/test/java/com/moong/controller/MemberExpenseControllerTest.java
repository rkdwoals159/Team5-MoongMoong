package com.moong.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.request.memberexpense.MemberExpenseUpsertRequest;
import com.moong.dto.request.memberexpense.MemberExpensesUpsertRequest;
import com.moong.dto.response.memberexpense.LastMonthComparisonResponse;
import com.moong.dto.response.memberexpense.MemberExpensesUpsertResponse;
import io.restassured.http.ContentType;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
        String accessToken = jwtTokenGenerator.generateAccessToken(member);

        given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
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
        String accessToken = jwtTokenGenerator.generateAccessToken(member);

        given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .queryParam("startDate", startDate.toString())
                .queryParam("endDate", endDate.toString())
                .get("/api/expenses")
                .then()
                .statusCode(400);
    }

    @DisplayName("지난달 소비내역 통계를 모두 반환한다.")
    @Test
    void compareLastMonthExpense() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastMonth = now.minusMonths(1);

        Member member = memberGenerator.generateSaved("멤버1");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        crewGenerator.generateSaveCrews(petGroup, List.of(member));
        memberExpenseGenerator.generateSaved(
                lastMonth.toLocalDate(),
                "코코 과자",
                5000,
                "식비",
                "소분류",
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                lastMonth.toLocalDate(),
                "코코 약",
                5000,
                "의료",
                "소분류",
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 진료비",
                10000,
                "의료",
                "소분류",
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 옷",
                20000,
                "물품구매",
                "소분류",
                null,
                now,
                member
        );

        LastMonthComparisonResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .get("/api/expenses/compare/last-month")
                .then()
                .statusCode(200)
                .extract().as(LastMonthComparisonResponse.class);

        assertAll(
                () -> assertThat(response.totalRatio()).isEqualTo(200),
                () -> assertThat(response.medicalRatio()).isEqualTo(100),
                () -> assertThat(response.petName()).isEqualTo(savedPet.getName()),
                () -> assertThat(response.petImageUrl()).isEqualTo(member.getImageUrl())
        );
    }

    @DisplayName("지난달 소비내역이 0원일 때는 ratio로 null을 반환한다.")
    @Test
    void compareLastMonthExpense_lastMonthZero() {
        LocalDateTime now = LocalDateTime.now();

        Member member = memberGenerator.generateSaved("멤버1");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        crewGenerator.generateSaveCrews(petGroup, List.of(member));
        memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 진료비",
                15000,
                "의료",
                "소분류",
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 옷",
                20000,
                "물품구매",
                "소분류",
                null,
                now,
                member
        );

        LastMonthComparisonResponse response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .get("/api/expenses/compare/last-month")
                .then()
                .statusCode(200)
                .extract().as(LastMonthComparisonResponse.class);

        assertAll(
                () -> assertThat(response.totalRatio()).isNull(),
                () -> assertThat(response.medicalRatio()).isNull(),
                () -> assertThat(response.petName()).isEqualTo(savedPet.getName()),
                () -> assertThat(response.petImageUrl()).isEqualTo(member.getImageUrl())
        );
    }

    @DisplayName("소비내역 생성, 수정, 삭제 요청을 성공한다")
    @Test
    void upsertMemberExpenses() {
        Member member = memberGenerator.generateSaved("멤버1");
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
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
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .body(request)
                .patch("/api/expenses")
                .then()
                .statusCode(200)
                .extract().as(MemberExpensesUpsertResponse.class);

        assertThat(response.expenses()).hasSize(upsertRequests.size());
    }
}
