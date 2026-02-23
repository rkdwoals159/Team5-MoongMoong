package com.moong.repository.memberexpense;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.member.Member;
import com.moong.domain.memberexpense.MemberExpense;
import com.moong.domain.enums.MainCategoryType;
import com.moong.repository.BaseRepositoryTest;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class MemberExpenseJdbcRepositoryImplTest extends BaseRepositoryTest {

    @Autowired
    private MemberExpenseRepository memberExpenseRepository;

    @DisplayName("전달 받은 MemberExpense 리스트들의 데이터로 수정한다.")
    @Test
    void updateAllByBulkQuery() {
        Member member = memberGenerator.generateSaved("멤버1");
        List<MemberExpense> memberExpenses = memberExpenseGenerator.generatedListSaved(member);
        Long id1 = memberExpenses.get(0).getId();
        Long id2 = memberExpenses.get(1).getId();
        LocalDateTime now = LocalDateTime.now();
        MemberExpense updateExpense1 = memberExpenseGenerator.generateUnsaved(
                id1,
                now.toLocalDate(),
                "류몽민 닭갈비",
                15000,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                null,
                now,
                member
        );
        MemberExpense updateExpense2 = memberExpenseGenerator.generateUnsaved(
                id2,
                now.toLocalDate(),
                "항아리 수제비",
                10000,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                null,
                now,
                member
        );

        memberExpenseRepository.updateAllByBulkQuery(List.of(updateExpense1, updateExpense2));

        MemberExpense expectedMemberExpense1 = memberExpenseRepository.getById(id1);
        MemberExpense expectedMemberExpense2 = memberExpenseRepository.getById(id2);

        assertThat(expectedMemberExpense1.getUsage()).isEqualTo(updateExpense1.getUsage());
        assertThat(expectedMemberExpense2.getUsage()).isEqualTo(updateExpense2.getUsage());
    }
}
