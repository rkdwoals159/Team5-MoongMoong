package com.moong.service;

import com.moong.dto.response.MemberExpensePeriodResponse;
import com.moong.dto.response.ExpenseResponse;
import com.moong.domain.entity.MemberExpense;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.MemberExpenseRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberExpenseService {

    private final MemberExpenseRepository memberExpenseRepository;

    public MemberExpensePeriodResponse getMemberExpensesByPeriod(long memberId, LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new BusinessException(ErrorCode.INVALID_DATE_RANGE);
        }

        Sort sort = Sort.by(
                Order.desc(MemberExpense.SPENT_AT_COLUMN_NAME),
                Order.desc(MemberExpense.MODIFIED_AT_COLUMN_NAME)
        );

        List<MemberExpense> findMemberExpenses = memberExpenseRepository.findByMemberIdAndPeriod(
                memberId,
                startDate,
                endDate,
                sort
        );

        int total = findMemberExpenses.stream()
                .mapToInt(MemberExpense::getCost)
                .sum();

        List<ExpenseResponse> expenseResponses = findMemberExpenses.stream()
                .map(ExpenseResponse::new).toList();

        return new MemberExpensePeriodResponse(
                total, expenseResponses
        );
    }
}
