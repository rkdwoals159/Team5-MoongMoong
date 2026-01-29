package com.moong.service;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.GroupExpense;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.groupexpense.CategoryAnalysis;
import com.moong.domain.groupexpense.GroupExpenseDetail;
import com.moong.dto.response.groupexpense.CategoryAnalysisResponse;
import com.moong.dto.response.groupexpense.GroupExpensesDailyResponse;
import com.moong.dto.response.groupexpense.GroupExpensesResponse;
import com.moong.dto.response.groupexpense.MedicalCategoryAnalysisResponse;
import com.moong.repository.CrewRepository;
import com.moong.repository.GroupExpenseRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GroupExpenseService {

    private static final String MEDICAL_CATEGORY_NAME = "의료비";

    private final GroupExpenseRepository groupExpenseRepository;
    private final CrewRepository crewRepository;

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
                MEDICAL_CATEGORY_NAME,
                startDate,
                endDate,
                expenseSort
        );
        CategoryAnalysis categoryAnalysis = new CategoryAnalysis(medicalExpenses);
        long totalMedical = categoryAnalysis.getCategoryTotalCosts(MEDICAL_CATEGORY_NAME);
        Map<String, Long> medicalStatics = categoryAnalysis.getSubCategoryCosts(MEDICAL_CATEGORY_NAME);
        return new MedicalCategoryAnalysisResponse(totalMedical, medicalStatics);
    }

    //TODO 현민님이 해당 메서드를 후속 PR에서 사용하셔서 일단 머지될 때까지 놔두고 추후 중복코드 리팩터링
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
}
