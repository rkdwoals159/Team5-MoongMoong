package com.moong.service;

import com.moong.domain.entity.MonthlyGroupExpense;
import com.moong.domain.entity.MonthlyMemberExpense;
import com.moong.domain.report.GroupExpenseMemberRankings;
import com.moong.domain.report.MonthlyExpenseRegressionAnalyzer;
import com.moong.dto.response.regression.RegressionResponse;
import com.moong.repository.CrewRepository;
import com.moong.repository.PetGroupRepository;
import com.moong.repository.monthlyexpense.MonthlyGroupExpenseRepository;
import com.moong.repository.monthlyexpense.MonthlyMemberExpenseRepository;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MonthlyGroupExpenseService {

    private static final int MONTHLY_GROUP_EXPENSE_SAVE_BATCH_SIZE = 100;

    private final MonthlyGroupExpenseRepository monthlyGroupExpenseRepository;
    private final MonthlyMemberExpenseRepository monthlyMemberExpenseRepository;
    private final CrewRepository crewRepository;
    private final PetGroupRepository petGroupRepository;
    private final MonthlyExpenseRegressionAnalyzer regressionAnalyzer;

    public void saveAllMonthlyGroupExpenses(YearMonth yearMonth) {
        long petGroupCount = petGroupRepository.count();
        for (long i = 1; i <= petGroupCount; i += MONTHLY_GROUP_EXPENSE_SAVE_BATCH_SIZE) {
            long nextBatchCursor = Math.min(i + MONTHLY_GROUP_EXPENSE_SAVE_BATCH_SIZE, petGroupCount);
            List<MonthlyGroupExpense> groupExpenses = new ArrayList<>();
            for (long j = i; j <= nextBatchCursor; j++) {
                groupExpenses.add(calculateGroupExpense(yearMonth, j));
            }
            monthlyGroupExpenseRepository.saveAllByBulkQuery(groupExpenses);
        }
    }

    private MonthlyGroupExpense calculateGroupExpense(YearMonth yearMonth, long petGroupId) {
        List<Long> groupMemberIds = getGroupMemberIds(petGroupId);
        long totalAmount = monthlyMemberExpenseRepository.sumAllByMemberIdIsIn(
                groupMemberIds, yearMonth.getYear(), yearMonth.getMonthValue()
        );
        return new MonthlyGroupExpense(yearMonth, totalAmount, petGroupId);
    }

    public RegressionResponse getGroupExpensePrediction(YearMonth start, YearMonth end, long groupId) {
        List<MonthlyGroupExpense> monthlyExpenses = monthlyGroupExpenseRepository.findByPetGroupIdBetween(
                groupId,
                start.getYear(),
                start.getMonthValue(),
                end.getYear(),
                end.getMonthValue()
        );
        return regressionAnalyzer.predict(monthlyExpenses);
    }

    public MonthlyGroupExpense getByExpenseYearAndExpenseMonth(YearMonth yearMonth, long groupId) {
        return monthlyGroupExpenseRepository.getByExpenseYearAndExpenseMonth(yearMonth, groupId);
    }

    public GroupExpenseMemberRankings getMonthlyGroupMemberStats(YearMonth yearMonth, long groupId) {
        List<MonthlyMemberExpense> topMemberExpense = monthlyMemberExpenseRepository.findMonthlyMemberExpensesBetweenWithFetchedMember(
                        yearMonth.getYear(),
                        yearMonth.getMonthValue(),
                        getGroupMemberIds(groupId)
                )
                .stream()
                .toList();
        return GroupExpenseMemberRankings.fromMonthlyExpense(topMemberExpense);
    }

    private List<Long> getGroupMemberIds(long petGroupId) {
        return crewRepository.findAllByPetGroup_Id(petGroupId)
                .stream()
                .map(crew -> crew.getMember().getId())
                .toList();
    }
}
