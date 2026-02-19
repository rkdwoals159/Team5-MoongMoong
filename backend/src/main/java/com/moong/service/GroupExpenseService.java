package com.moong.service;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.GroupExpense;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import com.moong.domain.groupexpense.CategoryAnalysis;
import com.moong.domain.groupexpense.GroupExpenseDetail;
import com.moong.domain.report.ExpenseCategoryRankings;
import com.moong.domain.report.GroupExpenseMemberRanking;
import com.moong.domain.report.GroupExpenseMemberRankings;
import com.moong.domain.report.MonthlyExpenseRegressionAnalyzer;
import com.moong.dto.response.groupexpense.CategoryAnalysisResponse;
import com.moong.dto.response.groupexpense.GroupExpensesDailyResponse;
import com.moong.dto.response.groupexpense.GroupExpensesResponse;
import com.moong.dto.response.groupexpense.MedicalCategoryAnalysisResponse;
import com.moong.dto.response.memberexpense.ExpenseCategoryStatics;
import com.moong.dto.response.memberexpense.MemberExpenseStatics;
import com.moong.dto.response.regression.RegressionResponse;
import com.moong.repository.CrewRepository;
import com.moong.repository.groupexpense.GroupExpenseRepository;
import com.moong.repository.memberexpense.MemberExpenseRepository;
import com.moong.util.RegressionUtils;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GroupExpenseService {

    private final GroupExpenseRepository groupExpenseRepository;
    private final MemberExpenseRepository memberExpenseRepository;
    private final CrewRepository crewRepository;
    private final MonthlyExpenseRegressionAnalyzer expenseRegressionAnalyzer;

    public GroupExpensesResponse findGroupExpensesByPeriod(
            Member member,
            LocalDate startDate,
            LocalDate endDate
    ) {
        List<GroupExpenseDetail> periodExpenses = findGroupExpensesBetween(member, startDate, endDate);
        return new GroupExpensesResponse(periodExpenses);
    }

    public CategoryAnalysisResponse findCategoryAnalysisByPeriod(
            Member member,
            LocalDate startDate,
            LocalDate endDate
    ) {
        List<GroupExpenseDetail> periodExpenses = findGroupExpensesBetween(member, startDate, endDate);
        CategoryAnalysis categoryAnalysis = new CategoryAnalysis(periodExpenses);
        return new CategoryAnalysisResponse(categoryAnalysis);
    }

    public MedicalCategoryAnalysisResponse findMedicalCategoryAnalysisByPeriod(
            Member member,
            LocalDate startDate,
            LocalDate endDate
    ) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        Sort expenseSort = getSortBySpentAtAndModifiedAt();
        List<GroupExpenseDetail> medicalExpenses = groupExpenseRepository.getFetchedByPetGroupIdAndMainCategoryAndPeriod(
                crew.getPetGroup().getId(),
                MainCategoryType.MEDICAL_EXPENSES,
                startDate,
                endDate,
                expenseSort
        );
        CategoryAnalysis categoryAnalysis = new CategoryAnalysis(medicalExpenses);
        long totalMedical = categoryAnalysis.getCategoryTotalCosts(MainCategoryType.MEDICAL_EXPENSES);
        Map<SubCategoryType, Long> medicalStatics = categoryAnalysis.getSubCategoryCosts(MainCategoryType.MEDICAL_EXPENSES);
        return new MedicalCategoryAnalysisResponse(totalMedical, medicalStatics);
    }

    public GroupExpensesDailyResponse findBySpentAt(
            Member member,
            LocalDate spentAt
    ) {
        List<GroupExpenseDetail> dailyExpenses = findGroupExpensesBetween(member, spentAt, spentAt);
        return new GroupExpensesDailyResponse(dailyExpenses);
    }

    private List<GroupExpenseDetail> findGroupExpensesBetween(Member member, LocalDate startDate, LocalDate endDate) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        Sort expenseSort = getSortBySpentAtAndModifiedAt();
        return groupExpenseRepository.getFetchedByGroupIdAndPeriod(
                crew.getPetGroup().getId(),
                startDate,
                endDate,
                expenseSort
        );
    }

    private Sort getSortBySpentAtAndModifiedAt() {
        return Sort.by(
                Sort.Order.desc(String.format("%s.%s",
                                GroupExpense.MEMBER_EXPENSE_FILED_NAME,
                                MemberExpense.SPENT_AT_COLUMN_NAME
                        )
                ),
                Sort.Order.desc(String.format("%s.%s",
                                GroupExpense.MEMBER_EXPENSE_FILED_NAME,
                                MemberExpense.MODIFIED_AT_COLUMN_NAME
                        )
                )
        );
    }

    public ExpenseCategoryRankings getGroupCategoryStats(LocalDate startDate, LocalDate endDate, long groupId) {
        List<Long> memberExpenseIds = groupExpenseRepository.findAllByPetGroupId(groupId).stream()
                .map(groupExpense -> groupExpense.getMemberExpense().getId())
                .toList();
        List<ExpenseCategoryStatics> categoryStatics = memberExpenseRepository.findMembersCategoryStatics(
                startDate, endDate, memberExpenseIds
        );
        return new ExpenseCategoryRankings(categoryStatics);
    }

    public GroupExpenseMemberRankings getGroupExpenseRankings(long groupId, LocalDate startDate, LocalDate endDate) {
        List<Long> groupMemberIds = findGroupMemberIds(groupId);
        List<MemberExpenseStatics> memberExpenseStatics = memberExpenseRepository.findFetchedMembersExpenseStaticsBetween(
                startDate,
                endDate,
                groupMemberIds
        );

        return GroupExpenseMemberRankings.fromMemberStatics(memberExpenseStatics);
    }

    private List<Long> findGroupMemberIds(long groupId) {
        return crewRepository.findAllByPetGroup_IdWithFetchedMember(groupId)
                .stream()
                .map(crew -> crew.getMember().getId())
                .toList();
    }

    public RegressionResponse getGroupExpensePrediction(Member member, LocalDate startDate, LocalDate endDate) {
        List<Long> costHistory = findGroupExpensesBetween(member, startDate, endDate)
                .stream()
                .collect(
                        Collectors.groupingBy(GroupExpenseDetail::getSpentAtYearMonth,
                                Collectors.summingLong(GroupExpenseDetail::getCost))
                ).values()
                .stream()
                .toList();
        return expenseRegressionAnalyzer.predictByCostHistory(costHistory);
    }
}
