package com.moong.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.entity.GroupExpense;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;

class GroupExpenseRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private GroupExpenseRepository groupExpenseRepository;

    @DisplayName("기간내 그룹 소비를 정렬(spendAt desc > createdAt desc) 기준에 맞추어 가져온다")
    @Test
    void findByPeriod() {
        LocalDateTime now = LocalDateTime.now();
        Member coli = memberGenerator.generateSaved("coli");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, coli);
        MemberExpense memberExpense1 = new MemberExpense(
                1L,
                now.minusDays(1L).toLocalDate(),
                "류몽민 닭갈비",
                100,
                "식비",
                "소분류",
                "메모",
                now.minusDays(1L).plusSeconds(1L),
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
        GroupExpense expense1 = groupExpenseGenerator.generateSaved(petGroup, memberExpense1, coli.getName());
        GroupExpense expense2 = groupExpenseGenerator.generateSaved(petGroup, memberExpense2, coli.getName());
        GroupExpense expense3 = groupExpenseGenerator.generateSaved(petGroup, memberExpense3, coli.getName());
        Sort expenseSort = Sort.by(
                Sort.Order.desc(GroupExpense.SPENT_AT_COLUMN_NAME),
                Sort.Order.desc(GroupExpense.MODIFIED_AT_COLUMN_NAME)
        );

        List<GroupExpense> actual = groupExpenseRepository.findByPeriod(
                petGroup.getId(),
                now.minusDays(1L).toLocalDate(),
                now.toLocalDate(),
                expenseSort
        );

        assertThat(actual)
                .extracting(GroupExpense::getId)
                .containsExactly(expense3.getId(), expense1.getId(), expense2.getId());
    }

    @DisplayName("기간내 카테고리에 대한 그룹 소비를 정렬(spendAt desc > createdAt desc) 기준에 맞추어 가져온다")
    @Test
    void findByPetGroup_IdAndMainCategoryAndSpentAtBetween() {
        LocalDateTime now = LocalDateTime.now();
        Member coli = memberGenerator.generateSaved("coli");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, coli);
        MemberExpense memberExpense1 = new MemberExpense(
                1L,
                now.minusDays(1L).toLocalDate(),
                "류몽민 닭갈비",
                100,
                "식비",
                "소분류",
                "메모",
                now.minusDays(1L).plusSeconds(1L),
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
                "수건 구입",
                300,
                "생활비",
                "생필품",
                "메모",
                now,
                coli
        );
        GroupExpense expense1 = groupExpenseGenerator.generateSaved(petGroup, memberExpense1, coli.getName());
        GroupExpense expense2 = groupExpenseGenerator.generateSaved(petGroup, memberExpense2, coli.getName());
        Sort expenseSort = Sort.by(
                Sort.Order.desc(GroupExpense.SPENT_AT_COLUMN_NAME),
                Sort.Order.desc(GroupExpense.MODIFIED_AT_COLUMN_NAME)
        );

        List<GroupExpense> actual = groupExpenseRepository.findByPetGroup_IdAndMainCategoryAndSpentAtBetween(
                petGroup.getId(),
                "식비",
                now.minusDays(1L).toLocalDate(),
                now.toLocalDate(),
                expenseSort
        );

        assertThat(actual)
                .extracting(GroupExpense::getId)
                .containsExactly(expense1.getId(), expense2.getId());
    }
}
