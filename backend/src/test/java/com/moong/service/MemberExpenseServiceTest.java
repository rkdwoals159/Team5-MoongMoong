package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.GroupExpense;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import com.moong.dto.request.memberexpense.MemberExpenseUpsertRequest;
import com.moong.dto.request.memberexpense.MemberExpensesUpsertRequest;
import com.moong.dto.response.memberexpense.LastMonthComparisonResponse;
import com.moong.dto.response.memberexpense.MemberExpenseResponse;
import com.moong.dto.response.memberexpense.MemberExpensesPeriodResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.groupexpense.GroupExpenseRepository;
import com.moong.repository.memberexpense.MemberExpenseRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class MemberExpenseServiceTest extends BaseServiceTest {

    @Autowired
    private MemberExpenseService memberExpenseService;

    @Autowired
    private MemberExpenseRepository memberExpenseRepository;

    @Autowired
    private GroupExpenseRepository groupExpenseRepository;

    @DisplayName("기간 조회: 최신 소비일 우선, 동일 소비일이면 수정일 최신순으로 정렬된다")
    @Test
    void getMemberExpensesByPeriod_sortedBySpentAtDescAndModifiedAtDesc() {
        Member member = memberGenerator.generateSaved("멤버1");

        List<MemberExpense> memberExpenses = memberExpenseGenerator.generatedListSaved(member);
        MemberExpense memberExpense1 = memberExpenses.get(0);
        MemberExpense memberExpense2 = memberExpenses.get(1);
        MemberExpense memberExpense3 = memberExpenses.get(2);

        LocalDate tomorrow = LocalDate.now().plusDays(1);

        memberExpenseGenerator.generateSaved(
                tomorrow,
                "류몽민 닭갈비",
                10000,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                null,
                tomorrow.atTime(9, 0),
                member
        );

        long expectedTotal = Stream.of(memberExpense1, memberExpense2, memberExpense3)
                .mapToLong(MemberExpense::getCost)
                .sum();

        LocalDate startDate = LocalDate.now().minusDays(1);
        LocalDate endDate = LocalDate.now();

        MemberExpensesPeriodResponse response = memberExpenseService.getMemberExpensesByPeriod(
                member,
                startDate,
                endDate
        );

        assertAll(
                () -> assertThat(response.expenses()).hasSize(3),
                () -> assertThat(response.total()).isEqualTo(expectedTotal),
                () -> assertThat(response.expenses())
                        .extracting(MemberExpenseResponse::expenseId)
                        .containsExactly(
                                memberExpense3.getId(),
                                memberExpense2.getId(),
                                memberExpense1.getId()
                        )
        );
    }


    @DisplayName("시작 시간이 끝 시간보다 큰 경우 예외를 던진다")
    @Test
    void getMemberExpenses_invalidDateRange() {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = LocalDate.now().minusDays(1);
        Member member = memberGenerator.generateSaved("멤버1");

        assertThatThrownBy(() -> memberExpenseService.getMemberExpensesByPeriod(member, startDate, endDate))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.INVALID_DATE_RANGE.getMessage());
    }

    @DisplayName("지난달 소비내역 통계를 모두 반환한다.")
    @Test
    void compareLastMonthExpense() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastMonth = now.minusMonths(1);

        Member member = memberGenerator.generateSaved("멤버1");
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        crewGenerator.generateSaveCrews(petGroup, List.of(member));

        memberExpenseGenerator.generateSaved(
                lastMonth.toLocalDate(),
                "코코 과자",
                5000,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                lastMonth.toLocalDate(),
                "코코 약",
                5000,
                MainCategoryType.MEDICAL_EXPENSES,
                null,
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 진료비",
                10000,
                MainCategoryType.MEDICAL_EXPENSES,
                null,
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 옷",
                20000,
                MainCategoryType.SUPPLIES,
                null,
                null,
                now,
                member
        );

        LastMonthComparisonResponse response = memberExpenseService.compareLastMonthExpense(member);

        assertAll(
                () -> assertThat(response.totalRatio()).isEqualTo(200),
                () -> assertThat(response.medicalRatio()).isEqualTo(100),
                () -> assertThat(response.petName()).isEqualTo(savedPet.getName()),
                () -> assertThat(response.petImageUrl()).isEqualTo(member.getImageUrl())
        );
    }

    @DisplayName("지난달 소비내역이 0원일 때는 ratio로 null을 반환한다.")
    @Test
    void compareLastMonthExpense_lastMonthZero() {
        LocalDateTime now = LocalDateTime.now();

        Member member = memberGenerator.generateSaved("멤버1");
        Pet savedPet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(savedPet);
        crewGenerator.generateSaveCrews(petGroup, List.of(member));
        memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 진료비",
                15000,
                MainCategoryType.MEDICAL_EXPENSES,
                null,
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 옷",
                20000,
                MainCategoryType.SUPPLIES,
                null,
                null,
                now,
                member
        );

        LastMonthComparisonResponse response = memberExpenseService.compareLastMonthExpense(member);

        assertAll(
                () -> assertThat(response.totalRatio()).isNull(),
                () -> assertThat(response.medicalRatio()).isNull(),
                () -> assertThat(response.petName()).isEqualTo(savedPet.getName()),
                () -> assertThat(response.petImageUrl()).isEqualTo(member.getImageUrl())
        );
    }

    @DisplayName("소비 내역 생성, 수정, 삭제 요청 시 GroupExpense도 함께 반영한다.")
    @Test
    void upsertMemberExpenses() {
        LocalDateTime now = LocalDateTime.now();
        Member member = memberGenerator.generateSaved("멤버1");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);
        MemberExpense memberExpense1 = memberExpenseGenerator.generateSaved(
                now.minusDays(2L).toLocalDate(),
                "류몽민 닭갈비",
                100,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now.minusDays(2L),
                member
        );
        MemberExpense memberExpense2 = memberExpenseGenerator.generateSaved(
                now.minusDays(1L).toLocalDate(),
                "항아리 수제비",
                200,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now.minusDays(1L),
                member
        );
        MemberExpense memberExpense3 = memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "우럭 회",
                300,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "메모",
                now,
                member
        );
        List<MemberExpense> memberExpenses = List.of(memberExpense1, memberExpense2, memberExpense3);
        MemberExpense updateTarget = memberExpenses.get(0);
        List<MemberExpense> deleteTargets = memberExpenses.subList(1, memberExpenses.size());
        List<Long> deleteTargetIds = deleteTargets.stream().map(MemberExpense::getId).toList();
        memberExpenses.forEach(me -> groupExpenseGenerator.generateSaved(petGroup, me));
        MemberExpenseUpsertRequest newRequest = new MemberExpenseUpsertRequest(
                true,
                null,
                now.toLocalDate(),
                "신규 약값",
                15000,
                MainCategoryType.MEDICAL_EXPENSES,
                SubCategoryType.MEDICATION,
                "정기"
        );
        MemberExpenseUpsertRequest updateRequest = new MemberExpenseUpsertRequest(
                false,
                updateTarget.getId(),
                now.toLocalDate(),
                "수정 사료",
                45000,
                MainCategoryType.FOOD_AND_TREATS,
                null,
                "할인"
        );
        MemberExpensesUpsertRequest totalRequest = new MemberExpensesUpsertRequest(
                List.of(newRequest, updateRequest),
                deleteTargetIds
        );

        memberExpenseService.upsertMemberExpenses(member, totalRequest);

        List<MemberExpense> afterMemberExpenses = memberExpenseRepository.findAllByMemberId(member.getId());
        List<GroupExpense> afterGroupExpenses = groupExpenseRepository.findAllByPetGroupId(petGroup.getId());
        List<Long> afterMemberExpenseIds = afterMemberExpenses.stream().map(MemberExpense::getId).toList();
        List<Long> afterGroupExpenseMemberIds = afterGroupExpenses.stream()
                .map(ge -> ge.getMemberExpense().getId())
                .toList();
        assertAll(
                () -> assertThat(afterMemberExpenseIds).hasSize(2),
                () -> assertThat(afterMemberExpenseIds).doesNotContainAnyElementsOf(deleteTargetIds),
                () -> assertThat(afterGroupExpenses).hasSize(2),
                () -> assertThat(afterGroupExpenseMemberIds)
                        .containsAll(afterMemberExpenseIds),
                () -> assertThat(afterGroupExpenseMemberIds)
                        .doesNotContainAnyElementsOf(deleteTargetIds)
        );
    }
}
