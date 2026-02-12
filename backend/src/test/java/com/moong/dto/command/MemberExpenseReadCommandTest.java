package com.moong.dto.command;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;

class MemberExpenseReadCommandTest {

    @DisplayName("메인 카테고리 필터 조건이 있는지 판단할 수 있다")
    @Test
    void hasMainCategory() {
        MemberExpenseReadCommand categoryCommand = new MemberExpenseReadCommand(
                new Member("email@email.com", "name", "imageUrl"),
                LocalDate.now().minusDays(1L),
                LocalDate.now(),
                "mainCateogry",
                PageRequest.of(1, 10)
        );

        assertThat(categoryCommand.hasMainCategory()).isTrue();
    }

    @DisplayName("메인 카테고리 필터 조건이 없는지 판단할 수 있다")
    @Test
    void hasNotMainCategory() {
        MemberExpenseReadCommand nonCategoryCommand = new MemberExpenseReadCommand(
                new Member("email@email.com", "name", "imageUrl"),
                LocalDate.now().minusDays(1L),
                LocalDate.now(),
                null,
                PageRequest.of(1, 10)
        );

        assertThat(nonCategoryCommand.hasMainCategory()).isFalse();
    }

    @DisplayName("시작일이 종료일보다 늦는지 검증할 수 있다")
    @Test
    void validatePeriod() {
        LocalDate today = LocalDate.now();
        assertThatThrownBy(() -> new MemberExpenseReadCommand(
                new Member("email@email.com", "name", "imageUrl"),
                today,
                today.minusDays(1L),
                null,
                PageRequest.of(1, 10)
        )).isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.INVALID_DATE_RANGE.getMessage());
    }

    @DisplayName("modifiedAt 정렬조건을 마지막 정렬조건으로 추가한다")
    @Test
    void addDefaultSortingOption() {
        MemberExpenseReadCommand nonCategoryCommand = new MemberExpenseReadCommand(
                new Member("email@email.com", "name", "imageUrl"),
                LocalDate.now().minusDays(1L),
                LocalDate.now(),
                null,
                PageRequest.of(1, 10, Sort.by(Sort.Direction.ASC, "cost"))
        );

        List<Order> orders = nonCategoryCommand.getPageable().getSort().toList();

        assertAll(
                () -> assertThat(orders).hasSize(2),
                () -> assertThat(orders.get(0).getProperty()).isEqualTo("cost"),
                () -> assertThat(orders.get(0).getDirection()).isEqualTo(Sort.Direction.ASC),
                () -> assertThat(orders.get(1).getProperty()).isEqualTo(MemberExpense.MODIFIED_AT_COLUMN_NAME),
                () -> assertThat(orders.get(1).getDirection()).isEqualTo(Sort.Direction.DESC)
        );
    }


}
