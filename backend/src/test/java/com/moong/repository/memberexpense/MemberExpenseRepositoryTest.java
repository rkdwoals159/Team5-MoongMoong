package com.moong.repository.memberexpense;


import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.repository.BaseRepositoryTest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
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

    @DisplayName("멤버의 소비내역을 페이지네이션으로 조회")
    @Test
    void findByMemberIdAndSpentAtBetween_Pagination() {
        Member member = memberGenerator.generateSaved("멤버1");
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(today, "사용처1", 100, "카테고리1", null, null, null, member);
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(today, "사용처2", 100, "카테고리2", null, null, null, member);
        MemberExpense memberExpense3 = memberExpenseGenerator.generateSaved(today, "사용처3", 100, "카테고리3", null, null, null, member);
        MemberExpense memberExpense4 = memberExpenseGenerator.generateSaved(today, "사용처4", 100, "카테고리4", null, null, null, member);

        List<MemberExpense> result = memberExpenseRepository.findByMember_IdAndSpentAtBetween(
                member.getId(),
                yesterday,
                today,
                PageRequest.of(1, 2)
        ).getContent();

        assertThat(result)
                .contains(memberExpense3, memberExpense4)
                .doesNotContain(memberExpense1, memberExpense2);
    }

    @DisplayName("멤버의 소비내역을 카테고리 필터 + 페이지네이션으로 조회")
    @Test
    void findByMemberIdAndSpentAtBetween_Pagination_With_CategoryFilter() {
        Member member = memberGenerator.generateSaved("멤버1");
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(today, "사용처1", 100, "카테고리1", null, null, null, member);
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(today, "사용처2", 100, "카테고리2", null, null, null, member);
        MemberExpense memberExpense3 = memberExpenseGenerator.generateSaved(today, "사용처3", 100, "카테고리2", null, null, null, member);
        MemberExpense memberExpense4 = memberExpenseGenerator.generateSaved(today, "사용처4", 100, "카테고리2", null, null, null, member);

        List<MemberExpense> result = memberExpenseRepository.findByMember_IdAndMainCategoryAndSpentAtBetween(
                member.getId(),
                "카테고리2",
                yesterday,
                today,
                PageRequest.of(1, 2)
        ).getContent();

        assertThat(result)
                .contains(memberExpense4) //카테고리2 + 페이지1
                .doesNotContain(memberExpense1, memberExpense2, memberExpense3); //카테고리1, 페이지0, 페이지2
    }

    @DisplayName("멤버의 소비 내역의 합을 기간 기준으로 반환한다.")
    @Test
    void sumCostByMemberIdAndPeriod() {
        LocalDateTime now = LocalDateTime.now();
        Member member = memberGenerator.generateSaved("멤버1");

        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 과자",
                1000,
                "식비",
                "소분류",
                null,
                now,
                member
        );
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 약",
                10000,
                "의료",
                "소분류",
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                now.toLocalDate().minusDays(2),
                "코코 진료비",
                15000,
                "의료",
                "소분류",
                null,
                now,
                member
        );

        long expected = List.of(memberExpense1, memberExpense2)
                .stream()
                .mapToLong(MemberExpense::getCost).sum();

        long result = memberExpenseRepository.sumCostByMemberIdAndPeriod(
                member.getId(),
                now.toLocalDate().minusDays(1),
                now.toLocalDate().plusDays(1)
        );

        assertThat(result).isEqualTo(expected);
    }

    @DisplayName("멤버의 메인 카테고리의 소비 내역의 합을 기간 기준으로 반환한다.")
    @Test
    void sumCostByMainCategoryAndPeriod() {
        LocalDateTime now = LocalDateTime.now();
        Member member = memberGenerator.generateSaved("멤버1");

        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 약1",
                1000,
                "의료",
                "소분류",
                null,
                now,
                member
        );
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 약2",
                10000,
                "의료",
                "소분류",
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 과자",
                15000,
                "식비",
                "소분류",
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                now.toLocalDate().minusDays(2),
                "코코 진료비",
                15000,
                "의료",
                "소분류",
                null,
                now,
                member
        );

        long expected = List.of(memberExpense1, memberExpense2)
                .stream()
                .mapToLong(MemberExpense::getCost).sum();

        long result = memberExpenseRepository.sumCostByMemberIdAndMainCategoryAndPeriod(
                member.getId(),
                "의료",
                now.toLocalDate().minusDays(1),
                now.toLocalDate().plusDays(1)
        );

        assertThat(result).isEqualTo(expected);
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
