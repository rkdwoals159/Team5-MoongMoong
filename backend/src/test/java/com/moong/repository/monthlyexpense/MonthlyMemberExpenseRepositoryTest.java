package com.moong.repository.monthlyexpense;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MonthlyMemberExpense;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.BaseRepositoryTest;
import java.time.YearMonth;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class MonthlyMemberExpenseRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private MonthlyMemberExpenseRepository monthlyMemberExpenseRepository;

    @DisplayName("회원들의 월별 소비 내역을 가져올 수 있다")
    @Test
    void findMonthlyMemberExpensesBetweenWithFetchedMember() {
        YearMonth now = YearMonth.now();
        Member member1 = memberGenerator.generateSaved("건우");
        Member member2 = memberGenerator.generateSaved("건우");
        MonthlyMemberExpense memberExpense1 = monthlyMemberExpenseGenerator.generate(member1, now, 100L);
        MonthlyMemberExpense memberExpense2 = monthlyMemberExpenseGenerator.generate(member2, now, 100L);

        List<MonthlyMemberExpense> expenses = monthlyMemberExpenseRepository.findMonthlyMemberExpensesBetweenWithFetchedMember(
                now.getYear(),
                now.getMonthValue(),
                List.of(member1.getId(), member2.getId())
        );

        assertThat(expenses)
                .extracting(MonthlyMemberExpense::getId)
                .containsExactly(memberExpense1.getId(), memberExpense2.getId());
    }

    @DisplayName("회원들의 월별 소비 내역을 합하여 가져올 수 있다")
    @Test
    void sumAllByMemberIdIsIn() {
        YearMonth now = YearMonth.now();
        Member member1 = memberGenerator.generateSaved("건우");
        Member member2 = memberGenerator.generateSaved("건우");
        MonthlyMemberExpense memberExpense1 = monthlyMemberExpenseGenerator.generate(member1, now, 100L);
        MonthlyMemberExpense memberExpense2 = monthlyMemberExpenseGenerator.generate(member2, now, 100L);

        long actual = monthlyMemberExpenseRepository.sumAllByMemberIdIsIn(
                List.of(member1.getId(), member2.getId()),
                now.getYear(),
                now.getMonthValue()
        );

        assertThat(actual).isEqualTo(memberExpense1.getTotalAmount() + memberExpense2.getTotalAmount());
    }

    @DisplayName("정해진 기간 내의 멤버의 소비내역을 가져올 수 있다")
    @Test
    void findByMemberIdBetween() {
        YearMonth now = YearMonth.now();
        YearMonth lastMonth = now.minusMonths(1);
        YearMonth twoMonthAgo = now.minusMonths(2);
        Member member = memberGenerator.generateSaved("건우");
        Member member2 = memberGenerator.generateSaved("현민");
        MonthlyMemberExpense expense1 = monthlyMemberExpenseGenerator.generate(member, now, 100L);
        MonthlyMemberExpense expense2 = monthlyMemberExpenseGenerator.generate(member, lastMonth, 100L);
        MonthlyMemberExpense expense3 = monthlyMemberExpenseGenerator.generate(member, twoMonthAgo, 100L);
        MonthlyMemberExpense expense4 = monthlyMemberExpenseGenerator.generate(member2, twoMonthAgo, 100L);

        List<MonthlyMemberExpense> actual = monthlyMemberExpenseRepository.findByMemberIdBetween(
                member.getId(),
                twoMonthAgo.getYear(),
                twoMonthAgo.getMonthValue(),
                lastMonth.getYear(),
                lastMonth.getMonthValue()
        );

        assertThat(actual)
                .extracting(MonthlyMemberExpense::getId)
                .doesNotContain(expense1.getId(), expense4.getId())
                .containsExactly(expense3.getId(), expense2.getId());
    }

    @DisplayName("특정 월의 멤버의 소비내역을 가져올 수 있다")
    @Test
    void getByExpenseYearAndExpenseMonthSuccess() {
        YearMonth now = YearMonth.now();
        Member member = memberGenerator.generateSaved("건우");
        MonthlyMemberExpense expense1 = monthlyMemberExpenseGenerator.generate(member, now, 100L);

        MonthlyMemberExpense actual = monthlyMemberExpenseRepository.getByExpenseYearAndExpenseMonth(now, member.getId());

        assertThat(actual.getId()).isEqualTo(expense1.getId());
    }

    @DisplayName("특정 월의 멤버의 소비내역을 가져오지 못할 경우 에러를 발생시킨다")
    @Test
    void getByExpenseYearAndExpenseMonthFail() {
        YearMonth now = YearMonth.now();
        Member member = memberGenerator.generateSaved("건우");

        assertThatThrownBy(() -> monthlyMemberExpenseRepository.getByExpenseYearAndExpenseMonth(now, member.getId()))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.MONTHLY_MEMBER_EXPENSE_NOT_FOUND.getMessage());
    }
}
