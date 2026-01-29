package com.moong.repository.memberexpense;


import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.repository.BaseRepositoryTest;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;

class MemberExpenseRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private MemberExpenseRepository memberExpenseRepository;

    @DisplayName("멤버의 소비내역을 기간 기준으로 조회")
    @Test
    void findByMemberIdAndSpentAtBetween_filtersOnly() {
        Member member = memberGenerator.generateSaved("멤버1");
        List<MemberExpense> memberExpenses = memberExpenseGenerator.generatedListSaved(member);

        LocalDate startDate = LocalDate.now().minusDays(1);

        List<MemberExpense> result = memberExpenseRepository.findByMember_IdAndSpentAtBetween(
                member.getId(),
                startDate,
                startDate,
                Sort.unsorted()
        );

        assertThat(result)
                .contains(memberExpenses.get(0), memberExpenses.get(1))
                .doesNotContain(memberExpenses.get(2));
    }

    @DisplayName("멤버의 소비내역 대량 삭제를 확인한다.")
    @Test
    void deleteByMemberIdAndIds() {
        Member member = memberGenerator.generateSaved("멤버1");
        List<MemberExpense> memberExpenses = memberExpenseGenerator.generatedListSaved(member);
        List<Long> ids = memberExpenses.stream()
                .map(MemberExpense::getId)
                .toList();

        memberExpenseRepository.deleteByMemberIdAndIds(member.getId(), ids);

        List<MemberExpense> found = memberExpenseRepository.findAllByMemberId(member.getId());

        assertThat(found).doesNotContainAnyElementsOf(memberExpenses);
    }
}
