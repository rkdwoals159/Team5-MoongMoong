package com.moong.service;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.memberexpense.MonthlyExpenseStats;
import com.moong.dto.request.memberexpense.MemberExpensesUpsertRequest;
import com.moong.dto.response.memberexpense.LastMonthComparisonResponse;
import com.moong.dto.response.memberexpense.MemberExpensesPeriodResponse;
import com.moong.domain.entity.MemberExpense;
import com.moong.dto.response.memberexpense.MemberExpensesUpsertResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.CrewRepository;
import com.moong.repository.memberexpense.MemberExpenseRepository;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberExpenseService {

    //TODO: ENUM 타입으로 분리
    private static final String MEDICAL_CATEGORY_NAME = "의료";

    private final MemberExpenseRepository memberExpenseRepository;
    private final CrewRepository crewRepository;

    public MemberExpensesPeriodResponse getMemberExpensesByPeriod(
            Member member,
            LocalDate startDate,
            LocalDate endDate
    ) {
        if (startDate.isAfter(endDate)) {
            throw new BusinessException(ErrorCode.INVALID_DATE_RANGE);
        }

        Sort sort = Sort.by(
                Order.desc(MemberExpense.SPENT_AT_COLUMN_NAME),
                Order.desc(MemberExpense.MODIFIED_AT_COLUMN_NAME)
        );

        List<MemberExpense> findMemberExpenses = memberExpenseRepository.findByMember_IdAndSpentAtBetween(
                member.getId(),
                startDate,
                endDate,
                sort
        );

        return new MemberExpensesPeriodResponse(findMemberExpenses);
    }

    public LastMonthComparisonResponse compareLastMonthExpense(Member member) {
        YearMonth currentMonth = YearMonth.now(ZoneId.of("Asia/Seoul"));
        YearMonth lastMonth = currentMonth.minusMonths(1);

        long previousTotal = getMonthlyTotal(member.getId(), lastMonth);
        long currentTotal = getMonthlyTotal(member.getId(), currentMonth);
        long previousMedicalTotal = getMainCategoryMonthlyTotal(
                member.getId(),
                MEDICAL_CATEGORY_NAME,
                lastMonth
        );
        long currentMedicalTotal = getMainCategoryMonthlyTotal(
                member.getId(),
                MEDICAL_CATEGORY_NAME,
                currentMonth
        );

        MonthlyExpenseStats monthlyStats = new MonthlyExpenseStats(
                previousTotal,
                previousMedicalTotal,
                currentTotal,
                currentMedicalTotal
        );

        Crew crew = crewRepository.getFetchedByMemberId(member.getId());
        Pet pet = crew.getPetGroup().getPet();

        return new LastMonthComparisonResponse(monthlyStats, pet.getName(), member.getImageUrl());
    }

    private long getMonthlyTotal(long memberId, YearMonth month) {
        return memberExpenseRepository.sumCostByMemberIdAndPeriod(
                memberId,
                month.atDay(1),
                month.atEndOfMonth()
        );
    }

    private long getMainCategoryMonthlyTotal(long memberId, String mainCategory, YearMonth month) {
        return memberExpenseRepository.sumCostByMemberIdAndMainCategoryAndPeriod(
                memberId,
                mainCategory,
                month.atDay(1),
                month.atEndOfMonth()
        );
    }

    @Transactional
    public MemberExpensesUpsertResponse upsertMemberExpenses(
            Member member,
            MemberExpensesUpsertRequest request
    ) {
        memberExpenseRepository.deleteByMemberIdAndIds(member.getId(), request.deletedIds());

        List<MemberExpense> expensesToCreate = request.getExpensesToCreate(member);
        List<MemberExpense> expensesToUpdate = request.getExpensesToUpdate(member);

        //TODO: groupExpense 테이블에도 수정, 삽입, 삭제 반영
        List<MemberExpense> savedExpenses = memberExpenseRepository.saveAll(expensesToCreate);
        memberExpenseRepository.updateAllByBulkQuery(expensesToUpdate);

        List<Long> ids = expensesToUpdate.stream()
                .map(MemberExpense::getId)
                .toList();

        List<MemberExpense> updatedExpenses = memberExpenseRepository.findAllByIds(ids);

        List<MemberExpense> expenses =
                Stream.concat(savedExpenses.stream(), updatedExpenses.stream())
                        .toList();

        return MemberExpensesUpsertResponse.from(expenses);
    }
}
