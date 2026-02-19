package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MonthlyGroupExpense;
import com.moong.domain.entity.MonthlyMemberExpense;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.report.GroupExpenseMemberRanking;
import com.moong.domain.report.GroupExpenseMemberRankings;
import com.moong.repository.monthlyexpense.MonthlyGroupExpenseRepository;
import java.time.YearMonth;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class MonthlyGroupExpenseServiceTest extends BaseServiceTest {

    @Autowired
    private MonthlyGroupExpenseService monthlyGroupExpenseService;

    @Autowired
    private MonthlyGroupExpenseRepository monthlyGroupExpenseRepository;

    @DisplayName("월별 그룹 소비내역을 저장할 수 있다")
    @Test
    void saveAllMonthlyGroupExpenses() {
        YearMonth yearmonth = YearMonth.now();
        Member geonwoo = memberGenerator.generateSaved("건우");
        Member hyeon = memberGenerator.generateSaved("현민");
        Member yeon = memberGenerator.generateSaved("연진");
        Member jaemin = memberGenerator.generateSaved("재민");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaveCrews(petGroup, List.of(geonwoo, hyeon, yeon, jaemin));
        MonthlyMemberExpense expense1 = monthlyMemberExpenseGenerator.generate(geonwoo, yearmonth, 300L);
        MonthlyMemberExpense expense2 = monthlyMemberExpenseGenerator.generate(hyeon, yearmonth, 200L);
        MonthlyMemberExpense expense3 = monthlyMemberExpenseGenerator.generate(yeon, yearmonth, 100L);
        MonthlyMemberExpense expense4 = monthlyMemberExpenseGenerator.generate(jaemin, yearmonth, 0L);

        monthlyGroupExpenseService.saveAllMonthlyGroupExpenses(yearmonth);

        MonthlyGroupExpense actual = monthlyGroupExpenseRepository.getByExpenseYearAndExpenseMonth(
                yearmonth, petGroup.getId()
        );

        assertAll(
                () -> assertThat(actual.getExpenseYear()).isEqualTo(yearmonth.getYear()),
                () -> assertThat(actual.getExpenseMonth()).isEqualTo(yearmonth.getMonthValue()),
                () -> assertThat(actual.getTotalAmount())
                        .isEqualTo(
                                expense1.getTotalAmount() +
                                        expense2.getTotalAmount() +
                                        expense3.getTotalAmount() +
                                        expense4.getTotalAmount()
                        )
        );
    }


    @DisplayName("월별 그룹 소비내역의 상위 3명의 멤버 랭킹을 구할 수 있다")
    @Test
    void getMonthlyGroupMemberStats() {
        YearMonth yearmonth = YearMonth.now();
        Member geonwoo = memberGenerator.generateSaved("건우");
        Member hyeon = memberGenerator.generateSaved("현민");
        Member yeon = memberGenerator.generateSaved("연진");
        Member jaemin = memberGenerator.generateSaved("재민");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaveCrews(petGroup, List.of(geonwoo, hyeon, yeon, jaemin));
        monthlyMemberExpenseGenerator.generate(geonwoo, yearmonth, 300L);
        monthlyMemberExpenseGenerator.generate(hyeon, yearmonth, 200L);
        monthlyMemberExpenseGenerator.generate(yeon, yearmonth, 100L);
        monthlyMemberExpenseGenerator.generate(jaemin, yearmonth, 0L);

        GroupExpenseMemberRankings rankings = monthlyGroupExpenseService.getMonthlyGroupMemberStats(
                yearmonth,
                petGroup.getId()
        );

        assertThat(rankings.getValues())
                .extracting(GroupExpenseMemberRanking::name)
                .containsExactly(geonwoo.getName(), hyeon.getName(), yeon.getName());
    }
}
