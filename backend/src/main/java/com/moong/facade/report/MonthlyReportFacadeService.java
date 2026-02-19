package com.moong.facade.report;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.MonthlyGroupExpense;
import com.moong.domain.entity.MonthlyMemberExpense;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.report.ExpenseCategoryRankings;
import com.moong.domain.report.GroupStats;
import com.moong.domain.report.GroupExpenseMemberRankings;
import com.moong.domain.report.MonthlyReport;
import com.moong.domain.report.PersonalStats;
import com.moong.dto.response.groupexpense.GroupExpensesResponse;
import com.moong.dto.response.memberexpense.LastMonthComparisonResponse;
import com.moong.dto.response.memberexpense.MemberExpensesPeriodResponse;
import com.moong.dto.response.regression.RegressionResponse;
import com.moong.service.CrewService;
import com.moong.service.GroupExpenseService;
import com.moong.service.GroupService;
import com.moong.service.MailService;
import com.moong.service.MemberExpenseService;
import com.moong.service.MonthlyGroupExpenseService;
import com.moong.service.MonthlyMemberExpenseService;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MonthlyReportFacadeService {

    private final MonthlyGroupExpenseService monthlyGroupExpenseService;
    private final MonthlyMemberExpenseService monthlyMemberExpenseService;
    private final GroupExpenseService groupExpenseService;
    private final MemberExpenseService memberExpenseService;
    private final CrewService crewService;
    private final MailService mailService;
    private final GroupService groupService;

    public void sendAllGroupMonthlyReport(YearMonth yearMonth) {
        groupService.findAll()
                .forEach(group -> sendGroupMonthlyReport(yearMonth, group.getId()));
    }

    public void sendGroupMonthlyReport(YearMonth yearMonth, long groupId) {

        //6개월간 예측 치
        YearMonth fiveMonthAgo = yearMonth.minusMonths(5);
        RegressionResponse groupExpensePrediction = monthlyGroupExpenseService.getGroupExpensePrediction(
                fiveMonthAgo,
                yearMonth,
                groupId
        );
        MonthlyGroupExpense groupExpense = monthlyGroupExpenseService.getByExpenseYearAndExpenseMonth(yearMonth, groupId);

        //지난 달 그룹 소비 회원 top3
        GroupExpenseMemberRankings memberStats = monthlyGroupExpenseService.getMonthlyGroupMemberStats(yearMonth, groupId);

        //지난 달 그룹 소비내역 카테고리 top3
        ExpenseCategoryRankings groupCategoryStats = groupExpenseService.getGroupCategoryStats(
                yearMonth.atDay(1),
                yearMonth.atEndOfMonth(),
                groupId
        );
        GroupStats groupStats = new GroupStats(groupExpense, groupExpensePrediction, memberStats, groupCategoryStats);


        List<MonthlyReport> reports = new ArrayList<>();
        List<Member> groupMembers = crewService.findAllMemberByGroupId(groupId);
        for (Member member : groupMembers) {
            RegressionResponse memberPrediction = monthlyMemberExpenseService.getMemberExpensePrediction(
                    fiveMonthAgo,
                    yearMonth,
                    member.getId()
            );

            MonthlyMemberExpense currentMonthExpense = monthlyMemberExpenseService.getByExpenseYearAndExpenseMonth(yearMonth, member.getId());
            long changeRate = calculateChangeRate(
                    currentMonthExpense,
                    monthlyMemberExpenseService.findByExpenseYearAndExpenseMonth(yearMonth.minusMonths(1L), member.getId())
            );

            //지난달 회원 소비내역 top3
            ExpenseCategoryRankings memberCategoryStats = memberExpenseService.getMemberCategoryStats(
                    yearMonth.atDay(1),
                    yearMonth.atEndOfMonth(),
                    member.getId()
            );

            PersonalStats personalStats = new PersonalStats(
                    currentMonthExpense,
                    memberPrediction,
                    changeRate,
                    yearMonth.lengthOfMonth(),
                    memberCategoryStats
            );
            reports.add(new MonthlyReport(member, yearMonth, personalStats, groupStats));
        }
        mailService.sendMonthlyReports(reports);
    }

    public void sendThisMonthReport(Member member) {
        YearMonth yearMonth = YearMonth.now();
        YearMonth fiveMonthAgo = yearMonth.minusMonths(5);

        Crew crew = crewService.getByMemberId(member.getId());
        long groupId = crew.getPetGroup().getId();

        GroupExpensesResponse groupExpensesByPeriod = groupExpenseService.findGroupExpensesByPeriod(
                member,
                yearMonth.atDay(1),
                yearMonth.atEndOfMonth()
        );

        RegressionResponse groupExpensePrediction = groupExpenseService.getGroupExpensePrediction(
                member,
                yearMonth.atDay(1),
                yearMonth.atEndOfMonth()
        );

        //지난 달 그룹 소비 회원 top3
        GroupExpenseMemberRankings memberStats = groupExpenseService.getGroupExpenseRankings(
            groupId,
            yearMonth.atDay(1),
            yearMonth.atEndOfMonth()
        );

        //지난 달 그룹 소비내역 카테고리 top3
        ExpenseCategoryRankings groupCategoryStats = groupExpenseService.getGroupCategoryStats(
                yearMonth.atDay(1),
                yearMonth.atEndOfMonth(),
                groupId
        );

        GroupStats groupStats = new GroupStats(
                groupExpensesByPeriod.total(),
                groupExpensesByPeriod.total() / yearMonth.lengthOfMonth(),
                groupExpensePrediction,
                memberStats,
                groupCategoryStats
        );

        //회원 예측 치
        RegressionResponse memberPrediction = memberExpenseService.predictNextMonthExpenses(
                member,
                fiveMonthAgo.atDay(1),
                yearMonth.atEndOfMonth()
        );

        //회원
        MemberExpensesPeriodResponse monthlyMemberExpense = memberExpenseService.getMemberExpensesByPeriod(
                member, yearMonth.atDay(1), yearMonth.atEndOfMonth()
        );

        //지난달과의 비교
        LastMonthComparisonResponse comparisonResponse = memberExpenseService.compareLastMonthExpense(member);

        //지난달 회원 소비내역 top3
        ExpenseCategoryRankings memberCategoryStats = memberExpenseService.getMemberCategoryStats(
                yearMonth.atDay(1),
                yearMonth.atEndOfMonth(),
                member.getId()
        );

        PersonalStats personalStats = new PersonalStats(
                monthlyMemberExpense.total(),
                monthlyMemberExpense.total()/ yearMonth.lengthOfMonth(),
                convertZeroIfNull(comparisonResponse.totalRatio()),
                yearMonth.lengthOfMonth(),
                memberPrediction,
                memberCategoryStats
        );
        MonthlyReport report = new MonthlyReport(member, yearMonth, personalStats, groupStats);
        mailService.sendMonthlyReport(report);
    }

    private long convertZeroIfNull(Integer value) {
        if(value == null) return 0;
        return value;
    }

    private long calculateChangeRate(
            MonthlyMemberExpense current,
            Optional<MonthlyMemberExpense> previous
    ) {
        if(previous.isPresent()) {
            long currentExpense = current.getTotalAmount();
            long previousExpense = previous.get().getTotalAmount();
            return Math.round((currentExpense - previousExpense) * 100.0 / previousExpense);
        }
        return 0;
    }
}
