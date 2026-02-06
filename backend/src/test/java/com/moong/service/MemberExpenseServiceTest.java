package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.request.memberexpense.MemberExpenseUpsertRequest;
import com.moong.dto.request.memberexpense.MemberExpensesUpsertRequest;
import com.moong.dto.response.memberexpense.LastMonthComparisonResponse;
import com.moong.dto.response.memberexpense.MemberExpenseResponse;
import com.moong.dto.response.memberexpense.MemberExpensesPeriodResponse;
import com.moong.dto.response.memberexpense.MemberExpensesUpsertResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
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
                "식비",
                "소분류",
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
                "식비",
                "소분류",
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                lastMonth.toLocalDate(),
                "코코 약",
                5000,
                "의료",
                "소분류",
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 진료비",
                10000,
                "의료",
                "소분류",
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 옷",
                20000,
                "물품구매",
                "소분류",
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
                "의료",
                "소분류",
                null,
                now,
                member
        );
        memberExpenseGenerator.generateSaved(
                now.toLocalDate(),
                "코코 옷",
                20000,
                "물품구매",
                "소분류",
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

    @DisplayName("소비 내역 생성, 수정, 삭제 요청을 모두 반영한다.")
    @Test
    void upsertMemberExpenses() {
        LocalDate now = LocalDate.now();
        Member member = memberGenerator.generateSaved("멤버1");
        List<MemberExpense> memberExpenses = memberExpenseGenerator.generatedListSaved(member);
        MemberExpense updateTarget = memberExpenses.get(0);
        List<MemberExpense> deleteTargets = memberExpenses.subList(1, memberExpenses.size());
        int expectedNewExpenseCount = 1;
        MemberExpenseUpsertRequest newExpenseRequest =
                new MemberExpenseUpsertRequest(
                        true,
                        null,
                        now,
                        "감기약 및 처방약 구매",
                        15000,
                        "병원비",
                        "약/처방",
                        "정기 구매"
                );
        MemberExpenseUpsertRequest updateExpenseRequest =
                new MemberExpenseUpsertRequest(
                        false,
                        updateTarget.getId(),
                        now,
                        "사료 대용량 구매",
                        4500000,
                        "식비",
                        "사료",
                        "대용량 할인"
                );
        List<MemberExpenseUpsertRequest> upsertRequests = List.of(newExpenseRequest, updateExpenseRequest);

        List<Long> deletedIds = deleteTargets.stream()
                .map(MemberExpense::getId)
                .toList();
        MemberExpensesUpsertRequest request = new MemberExpensesUpsertRequest(
                upsertRequests,
                deletedIds
        );
        List<Long> beforeIds = memberExpenses.stream()
                .map(MemberExpense::getId)
                .toList();

        MemberExpensesUpsertResponse response = memberExpenseService.upsertMemberExpenses(
                member,
                request
        );

        List<MemberExpense> after = memberExpenseRepository.findAllByMemberId(member.getId());
        List<Long> afterIds = after.stream()
                .map(MemberExpense::getId)
                .toList();
        List<Long> newIds = afterIds.stream()
                .filter(id -> !beforeIds.contains(id))
                .toList();

        assertAll(
                () -> assertThat(response.expenses()).hasSize(upsertRequests.size()),
                () -> assertThat(after.stream().map(MemberExpense::getId).toList())
                        .doesNotContainAnyElementsOf(deletedIds),
                () -> assertThat(response.expenses())
                        .anySatisfy(e -> {
                            assertThat(e.expenseId()).isEqualTo(updateExpenseRequest.expenseId());
                            assertThat(e.cost()).isEqualTo(updateExpenseRequest.cost());
                        }),
                () -> assertThat(newIds.size()).isEqualTo(expectedNewExpenseCount)
        );
    }

}
