package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.GroupExpense;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.response.groupexpense.GroupExpensesResponse;
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

        GroupExpensesResponse response = groupExpenseService.findByPeriod(
                coli,
                now.minusDays(1L).toLocalDate(),
                now.toLocalDate()
        );

        assertAll(
                () -> assertThat(response.total()).isEqualTo(500),
                () -> assertThat(response.expenses()).hasSize(2)
        );
    }
}
