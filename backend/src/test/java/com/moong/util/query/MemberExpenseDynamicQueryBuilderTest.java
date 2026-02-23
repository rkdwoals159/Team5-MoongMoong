package com.moong.util.query;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.moong.domain.member.Member;
import com.moong.domain.memberexpense.MemberExpense;
import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

class MemberExpenseDynamicQueryBuilderTest {

    @DisplayName("spentAt 정렬 조건이 없으면 에러를 반환한다.")
    @Test
    void spentAtOrdering() {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(1);
        MemberExpense expense = new MemberExpense(
                1L,
                today,
                "usage",
                1000,
                MainCategoryType.MEDICAL_EXPENSES,
                SubCategoryType.CONSULTATION,
                "",
                LocalDateTime.now(),
                new Member(1L, "email@email.com", "name", "imageUrl")
        );
        Sort sort = Sort.by(Direction.ASC, MemberExpenseColumn.ID.getDbColumn());
        MemberExpenseDynamicQueryBuilder queryBuilder = new MemberExpenseDynamicQueryBuilder();

        assertThatThrownBy(() -> queryBuilder.buildDynamicQueryWithLastRow(
                                                expense,
                                                expense.getSpentAt(),
                                                endDate,
                                                MainCategoryType.MEDICAL_EXPENSES,
                                                expense.getMember().getId(),
                                                sort,
                                                3)
                        ).isInstanceOf(BusinessException.class)
                        .hasMessage(ErrorCode.NOT_FOUND_SPENT_AT_ORDER.getMessage());
    }


    @DisplayName("mainCategory = MEDICAL_EXPENSES")
    @Test
    void mainCategory() {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(1);
        MemberExpense expense = new MemberExpense(
                1L,
                today,
                "usage",
                1000,
                MainCategoryType.MEDICAL_EXPENSES,
                SubCategoryType.CONSULTATION,
                "",
                LocalDateTime.now(),
                new Member(1L, "email@email.com", "name", "imageUrl")
        );
        Sort sort = Sort.by(Direction.ASC, MemberExpenseColumn.SPENT_AT.getDbColumn())
                .and(Sort.by(Direction.ASC, MemberExpenseColumn.ID.getDbColumn()));
        MemberExpenseDynamicQueryBuilder queryBuilder = new MemberExpenseDynamicQueryBuilder();
        String expected =
                "SELECT * FROM member_expense " +
                        "WHERE member_id = '1' AND main_category = 'MEDICAL_EXPENSES' " +
                        "AND ((spent_at > '" + expense.getSpentAt() + "' AND spent_at <= '" + endDate + "') " +
                        "OR (spent_at = '" + today + "' AND id > '1')) " +
                        "ORDER BY spent_at ASC, id ASC " +
                        "LIMIT 3;";

        String query = queryBuilder.buildDynamicQueryWithLastRow(
                expense,
                expense.getSpentAt(),
                endDate,
                MainCategoryType.MEDICAL_EXPENSES,
                expense.getMember().getId(),
                sort,
                3
        );

        assertThat(query).isEqualToIgnoringCase(expected);
    }

    @DisplayName("mainCategory = MEDICAL_EXPENSES + spentAt Asc")
    @Test
    void mainCategoryWithSpentAsc() {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(1);
        Sort sort = Sort.by(Sort.Direction.ASC, MemberExpenseColumn.SPENT_AT.getDbColumn())
                .and(Sort.by(Sort.Direction.ASC, MemberExpenseColumn.ID.getDbColumn()));
        MemberExpense expense = new MemberExpense(
                1L,
                today,
                "usage",
                1000,
                MainCategoryType.MEDICAL_EXPENSES,
                SubCategoryType.CONSULTATION,
                "",
                LocalDateTime.now(),
                new Member(1L, "email@email.com", "name", "imageUrl")
        );
        MemberExpenseDynamicQueryBuilder queryBuilder = new MemberExpenseDynamicQueryBuilder();
        String expected = "SELECT * FROM member_expense "
                + "WHERE member_id = '1' AND main_category = 'MEDICAL_EXPENSES' "
                + "AND ((spent_at > '" + today + "' AND spent_at <= '" + endDate + "') "
                + "OR (spent_at = '" + today + "' AND id > '1')) "
                + "ORDER BY SPENT_AT ASC, ID ASC "
                + "LIMIT 3;";

        String query = queryBuilder.buildDynamicQueryWithLastRow(
                expense,
                expense.getSpentAt(),
                endDate,
                MainCategoryType.MEDICAL_EXPENSES,
                expense.getMember().getId(),
                sort,
                3
        );
        assertThat(query).isEqualToIgnoringCase(expected);
    }

    @DisplayName("mainCategory = MEDICAL_EXPENSES + spentAt Desc")
    @Test
    void mainCategoryWithSpentDesc() {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(1);
        Sort sort = Sort.by(Direction.DESC, MemberExpenseColumn.SPENT_AT.getDbColumn())
                .and(Sort.by(Sort.Direction.ASC, MemberExpenseColumn.ID.getDbColumn()));
        MemberExpense expense = new MemberExpense(
                1L,
                today,
                "usage",
                1000,
                MainCategoryType.MEDICAL_EXPENSES,
                SubCategoryType.CONSULTATION,
                "",
                LocalDateTime.now(),
                new Member(1L, "email@email.com", "name", "imageUrl")
        );
        MemberExpenseDynamicQueryBuilder queryBuilder = new MemberExpenseDynamicQueryBuilder();
        String expected = "SELECT * FROM member_expense "
                + "WHERE member_id = '1' AND main_category = 'MEDICAL_EXPENSES' "
                + "AND ((spent_at >= '" + today + "' AND spent_at < '" + today + "') "
                + "OR (spent_at = '" + today + "' AND id > '1')) "
                + "ORDER BY SPENT_AT DESC, ID ASC "
                + "LIMIT 3;";

        String query = queryBuilder.buildDynamicQueryWithLastRow(
                expense,
                expense.getSpentAt(),
                endDate,
                MainCategoryType.MEDICAL_EXPENSES,
                expense.getMember().getId(),
                sort,
                3
        );
        assertThat(query).isEqualToIgnoringCase(expected);
    }

    @DisplayName("mainCategory = MEDICAL_EXPENSES + spentAt Desc + usage asc")
    @Test
    void mainCategoryWithSpentDesc_UsageAsc() {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(1);
        Sort sort = Sort.by(Sort.Direction.DESC, MemberExpenseColumn.SPENT_AT.getDbColumn())
                .and(Sort.by(Sort.Direction.ASC, MemberExpenseColumn.EXPENSE.getDbColumn()))
                .and(Sort.by(Sort.Direction.ASC, MemberExpenseColumn.ID.getDbColumn()));
        MemberExpense expense = new MemberExpense(
                1L,
                today,
                "usage",
                1000,
                MainCategoryType.MEDICAL_EXPENSES,
                SubCategoryType.CONSULTATION,
                "",
                LocalDateTime.now(),
                new Member(1L, "email@email.com", "name", "imageUrl")
        );
        MemberExpenseDynamicQueryBuilder queryBuilder = new MemberExpenseDynamicQueryBuilder();
        String expected = "SELECT * FROM member_expense "
                + "WHERE member_id = '1' AND main_category = 'MEDICAL_EXPENSES' "
                + "AND ((spent_at >= '" + today + "' AND spent_at < '" + expense.getSpentAt() + "') "
                + "OR (spent_at = '" + expense.getSpentAt() + "' AND expense_usage = '" + expense.getUsage() + "' AND id > '" + expense.getId() + "') "
                + "OR (spent_at = '" + expense.getSpentAt() + "' AND expense_usage > '" + expense.getUsage() + "')) "
                + "ORDER BY SPENT_AT DESC, EXPENSE_USAGE ASC, ID ASC "
                + "LIMIT 3;";

        String query = queryBuilder.buildDynamicQueryWithLastRow(
                expense,
                expense.getSpentAt(),
                endDate,
                MainCategoryType.MEDICAL_EXPENSES,
                expense.getMember().getId(),
                sort,
                3
        );

        assertThat(query).isEqualToIgnoringCase(expected);
    }

    @DisplayName("첫번째 쿼리 : mainCategory = MEDICAL_EXPENSES + spentAt Desc + usage asc")
    @Test
    void firstQuery_mainCategoryWithSpentDesc_UsageAsc() {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(1);
        Sort sort = Sort.by(Sort.Direction.DESC, MemberExpenseColumn.SPENT_AT.getDbColumn())
                .and(Sort.by(Sort.Direction.ASC, MemberExpenseColumn.EXPENSE.getDbColumn()))
                .and(Sort.by(Sort.Direction.ASC, MemberExpenseColumn.ID.getDbColumn()));
        MemberExpenseDynamicQueryBuilder queryBuilder = new MemberExpenseDynamicQueryBuilder();
        String expected = "SELECT * FROM member_expense "
                + "WHERE member_id = '1' AND main_category = 'MEDICAL_EXPENSES' "
                + "AND (spent_at >= '" + today + "' AND spent_at <= '" + endDate + "') "
                + "ORDER BY SPENT_AT DESC, EXPENSE_USAGE ASC, ID ASC "
                + "LIMIT 3;";

        String query = queryBuilder.buildFirstDynamicQuery(
                today,
                endDate,
                MainCategoryType.MEDICAL_EXPENSES,
                1L,
                sort,
                3
        );

        assertThat(query).isEqualToIgnoringCase(expected);
    }

    @DisplayName("첫번째 쿼리 : spentAt Desc + usage asc")
    @Test
    void firstQuery_SpentDesc_UsageAsc() {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(1);
        Sort sort = Sort.by(Direction.DESC, MemberExpenseColumn.SPENT_AT.getDbColumn())
                .and(Sort.by(Sort.Direction.ASC, MemberExpenseColumn.EXPENSE.getDbColumn()))
                .and(Sort.by(Sort.Direction.ASC, MemberExpenseColumn.ID.getDbColumn()));
        MemberExpenseDynamicQueryBuilder queryBuilder = new MemberExpenseDynamicQueryBuilder();
        String expected = "SELECT * FROM member_expense "
                + "WHERE member_id = '1' "
                + "AND (spent_at >= '" + today + "' AND spent_at <= '" + endDate + "') "
                + "ORDER BY SPENT_AT DESC, EXPENSE_USAGE ASC, ID ASC "
                + "LIMIT 3;";

        String query = queryBuilder.buildFirstDynamicQuery(
                today,
                endDate,
                null,
                1L,
                sort,
                3
        );

        assertThat(query).isEqualToIgnoringCase(expected);
    }
}
