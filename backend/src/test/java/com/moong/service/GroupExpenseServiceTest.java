package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.groupexpense.GroupExpense;
import com.moong.domain.member.Member;
import com.moong.domain.memberexpense.MemberExpense;
import com.moong.domain.pet.Pet;
import com.moong.domain.petgroup.PetGroup;
import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import com.moong.dto.response.groupexpense.CategoryAnalysisResponse;
import com.moong.dto.response.groupexpense.GroupExpensesDailyResponse;
import com.moong.dto.response.groupexpense.GroupExpensesResponse;
import com.moong.dto.response.groupexpense.MedicalCategoryAnalysisResponse;
import com.moong.service.groupexpense.GroupExpenseService;
import java.time.LocalDateTime;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class GroupExpenseServiceTest extends BaseServiceTest {

    @Autowired
    private GroupExpenseService groupExpenseService;


    @DisplayName("기한 내의 그룹 소비내역을 조회할 수 있다")
    @Test
    void findByGroupExpense() {
        LocalDateTime now = LocalDateTime.now();
        Member coli = memberGenerator.generateSaved("coli");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, coli);

        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.minusDays(2L).toLocalDate(),
                "류몽민 닭갈비",
                100,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now.minusDays(2L),
                coli
        );
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(
                now.minusDays(1L).toLocalDate(),
                "항아리 수제비",
                200,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now.minusDays(1L),
                coli
        );
        MemberExpense memberExpense3 = memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "우럭 회",
                300,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now,
                coli
        );

        groupExpenseGenerator.generateSaved(petGroup, memberExpense1);
        groupExpenseGenerator.generateSaved(petGroup, memberExpense2);
        groupExpenseGenerator.generateSaved(petGroup, memberExpense3);

        GroupExpensesResponse response = groupExpenseService.findGroupExpensesByPeriod(
                coli,
                now.minusDays(1L).toLocalDate(),
                now.toLocalDate()
        );
        assertAll(
                () -> assertThat(response.total()).isEqualTo(500),
                () -> assertThat(response.expenses()).hasSize(2)
        );
    }

    @DisplayName("기한 내의 그룹 소비내역의 카테고리별 분석 기록을 조회할 수 있다")
    @Test
    void findCategoryAnalysisByPeriod() {
        LocalDateTime now = LocalDateTime.now();
        Member coli = memberGenerator.generateSaved("coli");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, coli);
        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.minusDays(2L).toLocalDate(),
                "류몽민 닭갈비",
                100,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now.minusDays(2L),
                coli
        );
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(
                now.minusDays(1L).toLocalDate(),
                "수건 구입",
                200,
                MainCategoryType.SUPPLIES,
                null,
                "메모",
                now.minusDays(1L),
                coli
        );

        GroupExpense groupExpense1 = groupExpenseGenerator.generateSaved(petGroup, memberExpense1);
        GroupExpense groupExpense2 = groupExpenseGenerator.generateSaved(petGroup, memberExpense2);

        CategoryAnalysisResponse response = groupExpenseService.findCategoryAnalysisByPeriod(
                coli,
                now.minusDays(2L).toLocalDate(),
                now.toLocalDate()
        );

        assertAll(
                () -> assertThat(response.total()).isEqualTo(300),
                () -> assertThat(response.categoryAnalysis()).hasSize(2),
                () -> assertThat(response.categoryAnalysis().get(0).category()).isEqualTo(
                        groupExpense2.getMemberExpense().getMainCategory().getDescription()),
                () -> assertThat(response.categoryAnalysis().get(0).cost()).isEqualTo(
                        groupExpense2.getMemberExpense().getCost()),
                () -> assertThat(response.categoryAnalysis().get(1).category()).isEqualTo(
                        groupExpense1.getMemberExpense().getMainCategory().getDescription()),
                () -> assertThat(response.categoryAnalysis().get(1).cost()).isEqualTo(
                        groupExpense1.getMemberExpense().getCost())
        );
    }

    @DisplayName("특정 날짜의 그룹 소비 내역을 조회할 수 있다.")
    @Test
    void findBySpentAt() {
        LocalDateTime now = LocalDateTime.now();
        Member member = memberGenerator.generateSaved("softeer");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "류몽민 닭갈비",
                100,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now.minusDays(2L),
                member
        );
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "수건 구입",
                200,
                MainCategoryType.SUPPLIES,
                null,
                "메모",
                now.minusDays(1L),
                member
        );
        GroupExpense groupExpense1 = groupExpenseGenerator.generateSaved(petGroup, memberExpense1);
        GroupExpense groupExpense2 = groupExpenseGenerator.generateSaved(petGroup, memberExpense2);

        GroupExpensesDailyResponse response = groupExpenseService.findBySpentAt(
                member,
                now.toLocalDate()
        );

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

    @DisplayName("기한 내의 의료비 소비내역의 소분류별 분석 기록을 조회할 수 있다")
    @Test
    void findMedicalCategoryAnalysisByPeriod() {
        LocalDateTime now = LocalDateTime.now();
        Member coli = memberGenerator.generateSaved("coli");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, coli);
        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.minusDays(2L).toLocalDate(),
                "뚱이 수술",
                100,
                MainCategoryType.MEDICAL_EXPENSES,
                SubCategoryType.SURGERY_HOSPITALIZATION,
                "메모",
                now.minusDays(2L),
                coli
        );
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(
                now.minusDays(1L).toLocalDate(),
                "뚱이 약",
                200,
                MainCategoryType.MEDICAL_EXPENSES,
                SubCategoryType.MEDICATION,
                "메모",
                now.minusDays(1L),
                coli
        );
        GroupExpense groupExpense1 = groupExpenseGenerator.generateSaved(petGroup, memberExpense1);
        GroupExpense groupExpense2 = groupExpenseGenerator.generateSaved(petGroup, memberExpense2);

        MedicalCategoryAnalysisResponse response = groupExpenseService.findMedicalCategoryAnalysisByPeriod(
                coli,
                now.minusDays(2L).toLocalDate(),
                now.toLocalDate()
        );

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
}
