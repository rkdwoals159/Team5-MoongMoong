package com.moong.repository.groupexpense;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.GroupExpense;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.enums.MainCategoryType;
import com.moong.repository.BaseRepositoryTest;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class GroupExpenseJdbcRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private GroupExpenseRepository groupExpenseRepository;

    @DisplayName("전달 받은 GroupExpense 리스트들의 데이터를 저장한다.")
    @Test
    void saveAllByBulkQuery() {
        LocalDateTime now = LocalDateTime.now();
        Member member = memberGenerator.generateSaved("멤버1");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
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

        GroupExpense groupExpense1 = new GroupExpense(memberExpense1, petGroup);
        GroupExpense groupExpense2 = new GroupExpense(memberExpense2, petGroup);
        GroupExpense groupExpense3 = new GroupExpense(memberExpense3, petGroup);

        groupExpenseRepository.saveAllByBulkQuery(List.of(groupExpense1, groupExpense2, groupExpense3));

        List<GroupExpense> savedGroupExpenses = groupExpenseRepository.findAllByPetGroupId(petGroup.getId());
        assertAll(
                () -> assertThat(savedGroupExpenses).hasSize(3),
                () -> assertThat(savedGroupExpenses)
                        .extracting(groupExpense -> groupExpense.getMemberExpense().getId())
                        .containsExactly(
                                memberExpense1.getId(),
                                memberExpense2.getId(),
                                memberExpense3.getId()
                        )
        );
    }
}
