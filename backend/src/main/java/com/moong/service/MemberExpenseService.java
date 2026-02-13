package com.moong.service;

import com.moong.ai.OpenAiModel;
import com.moong.ai.OpenAiResult;
import com.moong.ai.TokenUsage;
import com.moong.client.categorize.ExpenseCategorizeClient;
import com.moong.domain.entity.GroupExpense;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import com.moong.dto.command.MemberExpenseReadCommand;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.request.memberexpense.CategorizeRequest;
import com.moong.dto.request.memberexpense.MemberExpensesUpsertRequest;
import com.moong.dto.response.categorize.AiCategorizeResponse;
import com.moong.dto.response.categorize.CategorizeResponse;
import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Pet;
import com.moong.domain.memberexpense.MonthlyExpenseStats;
import com.moong.dto.response.memberexpense.LastMonthComparisonResponse;
import com.moong.dto.response.memberexpense.MemberExpensesPeriodResponse;
import com.moong.dto.response.memberexpense.MemberExpensesPeriodResponseV2;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.CrewRepository;
import com.moong.repository.MemberRepository;
import com.moong.repository.PetGroupRepository;
import com.moong.repository.groupexpense.GroupExpenseRepository;
import com.moong.repository.memberexpense.MemberExpenseRepository;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberExpenseService {

    private final ExpenseCategorizeClient expenseCategorizeClient;
    private final MemberExpenseRepository memberExpenseRepository;
    private final CrewRepository crewRepository;
    private final GroupExpenseRepository groupExpenseRepository;

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

    public MemberExpensesPeriodResponseV2 getMemberExpensesByPeriodV2(MemberExpenseReadCommand command) {
        if(command.hasMainCategory()) {
            Slice<MemberExpense> findCategoryMemberExpenses = memberExpenseRepository.findByMember_IdAndMainCategoryAndSpentAtBetween(
                    command.getMember().getId(),
                    command.getMainCategory(),
                    command.getStartDate(),
                    command.getEndDate(),
                    command.getPageable()
            );
            return new MemberExpensesPeriodResponseV2(findCategoryMemberExpenses);
        }
        Slice<MemberExpense> findMemberExpenses = memberExpenseRepository.findByMember_IdAndSpentAtBetween(
                command.getMember().getId(),
                command.getStartDate(),
                command.getEndDate(),
                command.getPageable()
        );
        return new MemberExpensesPeriodResponseV2(findMemberExpenses);
    }

    public LastMonthComparisonResponse compareLastMonthExpense(Member member) {
        YearMonth currentMonth = YearMonth.now();
        YearMonth lastMonth = currentMonth.minusMonths(1);

        long previousTotal = getMonthlyTotal(member.getId(), lastMonth);
        long currentTotal = getMonthlyTotal(member.getId(), currentMonth);
        long previousMedicalTotal = getMainCategoryMonthlyTotal(
                member.getId(),
                MainCategoryType.MEDICAL_EXPENSES,
                lastMonth
        );
        long currentMedicalTotal = getMainCategoryMonthlyTotal(
                member.getId(),
                MainCategoryType.MEDICAL_EXPENSES,
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

    private long getMainCategoryMonthlyTotal(long memberId, MainCategoryType mainCategory, YearMonth month) {
        return memberExpenseRepository.sumCostByMemberIdAndMainCategoryAndPeriod(
                memberId,
                mainCategory,
                month.atDay(1),
                month.atEndOfMonth()
        );
    }

    @Transactional
    public void upsertMemberExpenses(
            Member member,
            MemberExpensesUpsertRequest request
    ) {
        Crew crew = crewRepository.getFetchedByMemberId(member.getId());
        PetGroup petGroup = crew.getPetGroup();
        memberExpenseRepository.deleteByMemberIdAndIds(member.getId(), request.deletedIds());
        groupExpenseRepository.deleteByGroupIdAndMemberExpenseIds(petGroup.getId(), request.deletedIds());

        List<MemberExpense> expensesToCreate = request.getExpensesToCreate(member);
        List<MemberExpense> expensesToUpdate = request.getExpensesToUpdate(member);

        List<MemberExpense> savedMemberExpenses = memberExpenseRepository.saveAll(expensesToCreate);
        memberExpenseRepository.updateAllByBulkQuery(expensesToUpdate);
        List<GroupExpense> groupExpenses = savedMemberExpenses.stream()
                .map((memberExpense ->
                    new GroupExpense(memberExpense, crew.getPetGroup())))
                .toList();
        groupExpenseRepository.saveAllByBulkQuery(groupExpenses);
    }

    public CategorizeResponse categorize(CategorizeRequest request) {
        //5초 이후에는 `기타` 값 반환
        OpenAiResult<AiCategorizeResponse> fallBackResponse = new OpenAiResult<>(
                AiCategorizeResponse.noneCategory(),
                TokenUsage.zeroUsage()
        );

        OpenAiResult<AiCategorizeResponse> result = expenseCategorizeClient.categorize(
                        request,
                        OpenAiModel.GPT_4_1_MODEL.getModel()
                )
                .completeOnTimeout(
                        fallBackResponse,
                        5L,
                        TimeUnit.SECONDS
                ).exceptionally(exception -> fallBackResponse)
                .join();

        MainCategoryType mainCategory = MainCategoryType.fromDescription(result.getResult().mainCategory());
        SubCategoryType subCategory = SubCategoryType.fromDescription(result.getResult().subCategory());
        return new CategorizeResponse(
                request.requestId(),
                mainCategory,
                subCategory
        );
    }
}
