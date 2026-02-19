package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.entity.MonthlyMemberExpense;
import com.moong.domain.enums.MainCategoryType;
import com.moong.repository.monthlyexpense.MonthlyMemberExpenseRepository;
import java.time.LocalDate;
import java.time.YearMonth;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class MonthlyMemberExpenseServiceTest extends BaseServiceTest {

    @Autowired
    private MonthlyMemberExpenseService monthlyMemberExpenseService;

    @Autowired
    private MonthlyMemberExpenseRepository monthlyMemberExpenseRepository;

    @DisplayName("회원의 월간 소비내역을 통계내어 저장한다")
    @Test
    void saveMonthlyMemberExpense() {
        YearMonth yearMonth = YearMonth.now();
        LocalDate now = LocalDate.now();
        Member member = memberGenerator.generateSaved("김건우");
        MemberExpense usage1 = memberExpenseGenerator.generateSaved(now, "usage1", 100L,
                MainCategoryType.FOOD_AND_TREATS, null, "", null, member);
        MemberExpense usage2 = memberExpenseGenerator.generateSaved(now, "usage1", 200L,
                MainCategoryType.FOOD_AND_TREATS, null, "", null, member);
        MemberExpense usage3 = memberExpenseGenerator.generateSaved(now, "usage3", 200L,
                MainCategoryType.FOOD_AND_TREATS, null, "", null, member);

        monthlyMemberExpenseService.saveAllMonthlyMemberExpense(yearMonth);

        MonthlyMemberExpense actual = monthlyMemberExpenseRepository.getByExpenseYearAndExpenseMonth(
                yearMonth, member.getId()
        );

        assertAll(
                () -> assertThat(actual.getExpenseYear()).isEqualTo(yearMonth.getYear()),
                () -> assertThat(actual.getExpenseMonth()).isEqualTo(yearMonth.getMonthValue()),
                () -> assertThat(actual.getTotalAmount()).isEqualTo(usage1.getCost() + usage2.getCost() + usage3.getCost())
        );
    }
}
