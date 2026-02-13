package com.moong.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.enums.MainCategoryType;
import com.moong.dto.request.memberexpense.MemberExpenseUpsertRequest;
import com.moong.dto.request.memberexpense.MemberExpensesUpsertRequest;
import com.moong.dto.response.memberexpense.LastMonthComparisonResponse;
import com.moong.dto.response.memberexpense.MemberExpenseResponse;
import com.moong.dto.response.memberexpense.MemberExpensesPeriodResponseV2;
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

    @DisplayName("기간 내의 개인 소비내역 반환 : spentAt DESC + category ASC")
    @Test
    void getMemberExpensesByPeriodSuccess_SpentAt_Desc_And_Category_Asc() {
        LocalDate startDate = LocalDate.of(2026, 1, 1);
        LocalDate endDate = LocalDate.of(2026, 1, 2);
        int pageSize = 2;
        int pageNo = 0;
        Member member = memberGenerator.generateSaved("멤버1");
        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(startDate, "사용처1", 100, MainCategoryType.MEDICAL_EXPENSES, null, null, null, member);
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(startDate, "사용처2", 200, MainCategoryType.FOOD_AND_TREATS, null, null, null, member);
        MemberExpense memberExpense3 = memberExpenseGenerator.generateSaved(endDate, "사용처3", 300, MainCategoryType.GROOMING, null, null, null, member);
        MemberExpense memberExpense4 = memberExpenseGenerator.generateSaved(endDate, "사용처4", 400, MainCategoryType.OTHER, null, null, null, member);
        String accessToken = jwtTokenGenerator.generateAccessToken(member);

        MemberExpensesPeriodResponseV2 response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + accessToken)
                .queryParam("startDate", startDate.toString())
                .queryParam("endDate", endDate.toString())
                .queryParam("sort", "spentAt,desc")
                .queryParam("sort", "mainCategory,asc")
                .queryParam("page", pageNo)
                .queryParam("size", pageSize)
                .get("/api/v2/expenses")
                .then()
                .statusCode(200)
                .extract()
                .as(MemberExpensesPeriodResponseV2.class);

        assertAll(
                () -> assertThat(response.total()).isEqualTo(memberExpense3.getCost() + memberExpense4.getCost()),
                () -> assertThat(response.size()).isEqualTo(pageSize),
                () -> assertThat(response.page()).isEqualTo(pageNo),
                () -> assertThat(response.hasNext()).isTrue(),
                () -> assertThat(response.expenses())
                        .extracting(MemberExpenseResponse::expenseId)
                        .containsExactly(memberExpense3.getId(), memberExpense4.getId())
        );
    }

    @DisplayName("기간 내의 개인 소비내역 반환 : spentAt DESC + category ASC + cost DESC")
    @Test
    void getMemberExpensesByPeriodSuccess_SpentAt_Desc_And_Category_Asc_Cost_DESC() {
        LocalDate startDate = LocalDate.of(2026, 1, 1);
        LocalDate endDate = LocalDate.of(2026, 1, 2);
        int pageSize = 4;
        int pageNo = 0;
        Member member = memberGenerator.generateSaved("멤버1");
        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(startDate, "사용처1", 100, MainCategoryType.FOOD_AND_TREATS, null, null, null, member);
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(startDate, "사용처2", 200, MainCategoryType.GROOMING, null, null, null, member);
        MemberExpense memberExpense3 = memberExpenseGenerator.generateSaved(endDate, "사용처3", 300, MainCategoryType.MEDICAL_EXPENSES, null, null, null, member);
        MemberExpense memberExpense4 = memberExpenseGenerator.generateSaved(endDate, "사용처4", 400, MainCategoryType.OTHER, null, null, null, member);
        MemberExpense memberExpense5 = memberExpenseGenerator.generateSaved(endDate, "사용처5", 500, MainCategoryType.SUPPLIES, null, null, null, member);
        MemberExpense memberExpense6 = memberExpenseGenerator.generateSaved(endDate, "사용처6", 600, MainCategoryType.SUPPLIES, null, null, null, member);
        String accessToken = jwtTokenGenerator.generateAccessToken(member);

        MemberExpensesPeriodResponseV2 response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + accessToken)
                .queryParam("startDate", startDate.toString())
                .queryParam("endDate", endDate.toString())
                .queryParam("sort", "spentAt,desc")
                .queryParam("sort", "mainCategory,asc")
                .queryParam("page", pageNo)
                .queryParam("size", pageSize)
                .get("/api/v2/expenses")
                .then()
                .statusCode(200)
                .extract()
                .as(MemberExpensesPeriodResponseV2.class);

        assertAll(
                () -> assertThat(response.total())
                        .isEqualTo(memberExpense3.getCost() + memberExpense4.getCost() + memberExpense5.getCost() + memberExpense6.getCost()),
                () -> assertThat(response.size()).isEqualTo(pageSize),
                () -> assertThat(response.page()).isEqualTo(pageNo),
                () -> assertThat(response.hasNext()).isTrue(),
                () -> assertThat(response.expenses())
                        .extracting(MemberExpenseResponse::expenseId)
                        .containsExactly(memberExpense3.getId(), memberExpense4.getId(), memberExpense6.getId(), memberExpense5.getId())
        );
    }

    @DisplayName("기간 내의 개인 소비내역 반환 : spentAt ASC + cost DESC + mainCategory = 카테고리1")
    @Test
    void getMemberExpensesByPeriodSuccess_SpentAt_ASC_And_Cost_DESC_And_Category_Filter() {
        LocalDate startDate = LocalDate.of(2026, 1, 1);
        LocalDate endDate = LocalDate.of(2026, 1, 2);
        int pageSize = 3;
        int pageNo = 0;
        MainCategoryType filteredMainCategory = MainCategoryType.MEDICAL_EXPENSES;
        Member member = memberGenerator.generateSaved("멤버1");
        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(startDate, "사용처1", 100, MainCategoryType.MEDICAL_EXPENSES, null, null, null, member);
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(startDate, "사용처2", 200, MainCategoryType.OTHER, null, null, null, member);
        MemberExpense memberExpense3 = memberExpenseGenerator.generateSaved(startDate, "사용처3", 300, MainCategoryType.MEDICAL_EXPENSES, null, null, null, member);
        MemberExpense memberExpense4 = memberExpenseGenerator.generateSaved(endDate, "사용처4", 400, MainCategoryType.OTHER, null, null, null, member);
        MemberExpense memberExpense5 = memberExpenseGenerator.generateSaved(endDate, "사용처5", 500, MainCategoryType.MEDICAL_EXPENSES, null, null, null, member);
        MemberExpense memberExpense6 = memberExpenseGenerator.generateSaved(endDate, "사용처6", 600, MainCategoryType.OTHER, null, null, null, member);
        MemberExpense memberExpense7 = memberExpenseGenerator.generateSaved(endDate, "사용처7", 700, MainCategoryType.MEDICAL_EXPENSES, null, null, null, member);
        String accessToken = jwtTokenGenerator.generateAccessToken(member);

        MemberExpensesPeriodResponseV2 response = given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX + accessToken)
                .queryParam("startDate", startDate.toString())
                .queryParam("endDate", endDate.toString())
                .queryParam("sort", "spentAt,asc")
                .queryParam("sort", "cost,desc")
                .queryParam("mainCategory", filteredMainCategory)
                .queryParam("page", pageNo)
                .queryParam("size", pageSize)
                .get("/api/v2/expenses")
                .then()
                .statusCode(200)
                .extract()
                .as(MemberExpensesPeriodResponseV2.class);

        assertAll(
                () -> assertThat(response.total())
                        .isEqualTo(memberExpense1.getCost() + memberExpense3.getCost() + memberExpense7.getCost()),
                () -> assertThat(response.size()).isEqualTo(pageSize),
                () -> assertThat(response.page()).isEqualTo(pageNo),
                () -> assertThat(response.hasNext()).isTrue(),
                () -> assertThat(response.expenses())
                        .extracting(MemberExpenseResponse::expenseId)
                        .containsExactly(memberExpense3.getId(), memberExpense1.getId(), memberExpense7.getId())
        );
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
                MainCategoryType.FOOD_AND_TREATS,
                null,
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                lastMonth.toLocalDate(),
                "코코 약",
                5000,
                MainCategoryType.MEDICAL_EXPENSES,
                null,
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 진료비",
                10000,
                MainCategoryType.MEDICAL_EXPENSES,
                null,
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 옷",
                20000,
                MainCategoryType.SUPPLIES,
                null,
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
                MainCategoryType.MEDICAL_EXPENSES,
                null,
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 옷",
                20000,
                MainCategoryType.SUPPLIES,
                null,
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
        LocalDateTime now = LocalDateTime.now();
        Member member = memberGenerator.generateSaved("멤버1");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        String accessToken = jwtTokenGenerator.generateAccessToken(member);
        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.minusDays(2L).toLocalDate(),
                "류몽민 닭갈비",
                100,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now.minusDays(2L),
                member
        );
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(
                now.minusDays(1L).toLocalDate(),
                "항아리 수제비",
                200,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now.minusDays(1L),
                member
        );
        MemberExpense memberExpense3 = memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "우럭 회",
                300,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now,
                member
        );
        List<MemberExpense> memberExpenses = List.of(memberExpense1, memberExpense2, memberExpense3);
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
                        MainCategoryType.FOOD_AND_TREATS,
                        null,
                        "10kg 대용량 구매"
                ),
                new MemberExpenseUpsertRequest(
                        true,
                        null,
                        LocalDate.of(2026, 1, 5),
                        "미용",
                        70000,
                        MainCategoryType.GROOMING,
                        null,
                        "털 정리"
                )
        );

        MemberExpensesUpsertRequest request = new MemberExpensesUpsertRequest(
                upsertRequests,
                deletedIds
        );

        given().log().all()
                .contentType(ContentType.JSON)
                .header(HttpHeaders.AUTHORIZATION, BEARER_PREFIX  + accessToken)
                .body(request)
                .patch("/api/expenses")
                .then()
                .statusCode(204);
    }
}
