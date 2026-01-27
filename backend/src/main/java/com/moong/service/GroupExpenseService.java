package com.moong.service;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.GroupExpense;
import com.moong.domain.entity.Member;
import com.moong.domain.groupexpense.CategoryAnalysis;
import com.moong.dto.response.groupexpense.CategoryAnalysisResponse;
import com.moong.dto.response.groupexpense.GroupExpensesResponse;
import com.moong.repository.CrewRepository;
import com.moong.repository.GroupExpenseRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GroupExpenseService {

    private final GroupExpenseRepository groupExpenseRepository;
    private final CrewRepository crewRepository;

    public GroupExpensesResponse findByPeriod(
            Member member,
            LocalDate startDate,
            LocalDate endDate
    ) {
        List<GroupExpense> periodExpenses = findGroupExpensesBetween(member, startDate, endDate);
        return new GroupExpensesResponse(periodExpenses);
    }

    public CategoryAnalysisResponse findCategoryAnalysis(
            Member member,
            LocalDate startDate,
            LocalDate endDate
    ) {
        List<GroupExpense> periodExpenses = findGroupExpensesBetween(member, startDate, endDate);
        CategoryAnalysis categoryAnalysis = new CategoryAnalysis(periodExpenses);
        return new CategoryAnalysisResponse(categoryAnalysis);
    }

    private List<GroupExpense> findGroupExpensesBetween(Member member, LocalDate startDate, LocalDate endDate) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        Sort expenseSort = Sort.by(
                Sort.Order.desc(GroupExpense.SPENT_AT_COLUMN_NAME),
                Sort.Order.desc(GroupExpense.MODIFIED_AT_COLUMN_NAME)
        );
        return groupExpenseRepository.findByPeriod(
                crew.getPetGroup().getId(),
                startDate,
                endDate,
                expenseSort
        );
    }
}
