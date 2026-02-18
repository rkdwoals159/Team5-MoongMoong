package com.moong.dto.command;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.enums.MainCategoryType;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.util.query.MemberExpenseColumn;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;

class MemberExpenseReadCommandTest {

    @DisplayName("메인 카테고리 필터 조건이 있는지 판단할 수 있다")
    @Test
    void hasMainCategory() {
        Sort sort = Sort.by(Direction.DESC, MemberExpenseColumn.SPENT_AT.getProperty());
        MemberExpenseReadCommand categoryCommand = new MemberExpenseReadCommand(
                new Member("email@email.com", "name", "imageUrl"),
                LocalDate.now().minusDays(1L),
                LocalDate.now(),
                null,
                MainCategoryType.FOOD_AND_TREATS.getDescription(),
                PageRequest.of(1, 10, sort)
        );

        assertThat(categoryCommand.hasMainCategory()).isTrue();
    }

    @DisplayName("메인 카테고리 필터 조건이 없는지 판단할 수 있다")
    @Test
    void hasNotMainCategory() {
        Sort sort = Sort.by(Direction.DESC, MemberExpenseColumn.SPENT_AT.getProperty());
        MemberExpenseReadCommand nonCategoryCommand = new MemberExpenseReadCommand(
                new Member("email@email.com", "name", "imageUrl"),
                LocalDate.now().minusDays(1L),
                LocalDate.now(),
                null,
                null,
                PageRequest.of(1, 10, sort)
        );

        assertThat(nonCategoryCommand.hasMainCategory()).isFalse();
    }

    @DisplayName("다음 행 조건이 있는지 판단할 수 있다")
    @Test
    void hasNotLastRowId() {
        Sort sort = Sort.by(Direction.DESC, MemberExpenseColumn.SPENT_AT.getProperty());
        MemberExpenseReadCommand categoryCommand = new MemberExpenseReadCommand(
                new Member("email@email.com", "name", "imageUrl"),
                LocalDate.now().minusDays(1L),
                LocalDate.now(),
                null,
                MainCategoryType.FOOD_AND_TREATS.getDescription(),
                PageRequest.of(1, 10, sort)
        );

        assertThat(categoryCommand.hasLastRowId()).isFalse();
    }

    @DisplayName("다음 행 조건이 없는지 판단할 수 있다")
    @Test
    void hasLastRowId() {
        Sort sort = Sort.by(Direction.DESC, MemberExpenseColumn.SPENT_AT.getProperty());
        MemberExpenseReadCommand categoryCommand = new MemberExpenseReadCommand(
                new Member("email@email.com", "name", "imageUrl"),
                LocalDate.now().minusDays(1L),
                LocalDate.now(),
                1L,
                MainCategoryType.FOOD_AND_TREATS.getDescription(),
                PageRequest.of(1, 10, sort)
        );

        assertThat(categoryCommand.hasLastRowId()).isTrue();
    }

    @DisplayName("시작일이 종료일보다 늦는지 검증할 수 있다")
    @Test
    void validatePeriod() {
        LocalDate today = LocalDate.now();
        Sort sort = Sort.by(Direction.DESC, MemberExpenseColumn.SPENT_AT.getProperty());
        assertThatThrownBy(() -> new MemberExpenseReadCommand(
                new Member("email@email.com", "name", "imageUrl"),
                today,
                today.minusDays(1L),
                null,
                null,
                PageRequest.of(1, 10, sort)
        )).isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.INVALID_DATE_RANGE.getMessage());
    }

    @DisplayName("id 정렬조건을 마지막 정렬조건으로 추가한다")
    @Test
    void addDefaultSortingOption() {
        Sort sort = Sort.by(Direction.DESC, MemberExpenseColumn.SPENT_AT.getProperty());
        MemberExpenseReadCommand nonCategoryCommand = new MemberExpenseReadCommand(
                new Member("email@email.com", "name", "imageUrl"),
                LocalDate.now().minusDays(1L),
                LocalDate.now(),
                null,
                null,
                PageRequest.of(1, 10, sort)
        );

        List<Order> orders = nonCategoryCommand.getPageable().getSort().toList();

        assertAll(
                () -> assertThat(orders).hasSize(2),
                () -> assertThat(orders.get(0).getProperty()).isEqualTo(MemberExpenseColumn.SPENT_AT.getDbColumn()),
                () -> assertThat(orders.get(0).getDirection()).isEqualTo(Direction.DESC),
                () -> assertThat(orders.get(1).getProperty()).isEqualTo(MemberExpenseColumn.ID.getProperty()),
                () -> assertThat(orders.get(1).getDirection()).isEqualTo(Sort.Direction.ASC)
        );
    }

    @DisplayName("정렬 조건이 있는지 검증할 수 있다")
    @Test
    void validateHasSort() {
        assertThatThrownBy(() -> new MemberExpenseReadCommand(
                    new Member("email@email.com", "name", "imageUrl"),
                    LocalDate.now().minusDays(1L),
                    LocalDate.now(),
                    null,
                    MainCategoryType.FOOD_AND_TREATS.getDescription(),
                    PageRequest.of(1, 10)))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.MEMBER_EXPENSE_SORT_NOT_START_WITH_SPENT_AT.getMessage());

    }

    @DisplayName("정렬 조건 spentAt으로 시작하는지 검증할 수 있다")
    @Test
    void validateSortStartWithSpentAt() {
        Sort sort = Sort.by(Direction.DESC, MemberExpenseColumn.COST.getProperty());

        assertThatThrownBy(() -> new MemberExpenseReadCommand(
                new Member("email@email.com", "name", "imageUrl"),
                LocalDate.now().minusDays(1L),
                LocalDate.now(),
                null,
                MainCategoryType.FOOD_AND_TREATS.getDescription(),
                PageRequest.of(1, 10, sort)))
                .isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.MEMBER_EXPENSE_SORT_NOT_START_WITH_SPENT_AT.getMessage());

    }
}
