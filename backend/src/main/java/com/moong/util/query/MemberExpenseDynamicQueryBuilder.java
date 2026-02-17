package com.moong.util.query;

import com.moong.domain.entity.MemberExpense;
import com.moong.domain.enums.MainCategoryType;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.time.LocalDate;
import java.util.List;
import java.util.StringJoiner;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Component;

@Component
public class MemberExpenseDynamicQueryBuilder {

    private static final String MEMBER_EXPENSE_TABLE_NAME = "member_expense";

    public String buildDynamicQueryWithLastRow(
            MemberExpense lastRow,
            LocalDate startDate,
            LocalDate endDate,
            MainCategoryType mainCategory,
            long memberId,
            Sort sort,
            int limit
    ) {
        List<Order> orders = sort.get().toList();
        StringJoiner joiner = new StringJoiner("");
        joiner.add("SELECT * ");
        joiner.add("FROM " + MEMBER_EXPENSE_TABLE_NAME + " ");
        joiner.add("WHERE " + equalsWith(MemberExpenseColumn.MEMBER_ID, String.valueOf(memberId)) + " "); //memberId = ?
        if (mainCategory != null) {
            joiner.add("AND " + equalsWith(MemberExpenseColumn.MAIN_CATEGORY, mainCategory.name()) + " "); //main_category = ?
        }

        //spent_at > :spentAt and spent_at <=:endDate
        joiner.add("AND (("
                + buildSpentAtCondition(sort, lastRow, startDate, endDate)
                + ")"
        );

        for (int i = orders.size(); i >= 2; i--) {
            joiner.add(" OR (" + getCondition(orders.subList(0, i), lastRow) + ")");
        }
        joiner.add(")");

        //order by :property [ASC | DESC]
        joiner.add(toOrderByClause(sort));

        //Limit ?
        joiner.add("LIMIT " + limit + ";");

        return joiner.toString();
    }

    public String buildFirstDynamicQuery(
            LocalDate startDate,
            LocalDate endDate,
            MainCategoryType mainCategory,
            long memberId,
            Sort sort,
            int limit
    ) {
        StringJoiner joiner = new StringJoiner("");
        joiner.add("SELECT * ");
        joiner.add("FROM " + MEMBER_EXPENSE_TABLE_NAME + " ");
        joiner.add("WHERE " + equalsWith(MemberExpenseColumn.MEMBER_ID, String.valueOf(memberId)) + " "); //memberId = ?

        //main_category = ?
        if (mainCategory != null) {
            joiner.add("AND " + equalsWith(MemberExpenseColumn.MAIN_CATEGORY, mainCategory.name()) + " ");
        }

        //spent_at >= :spentAt and spent_at <=:endDate
        joiner.add("AND ("
                + greaterOrEqualThan(MemberExpenseColumn.SPENT_AT, startDate.toString())
                + " AND "
                + lessOrEqualThan(MemberExpenseColumn.SPENT_AT, endDate.toString()) + ")"
        );

        //order by :property [ASC | DESC]
        joiner.add(toOrderByClause(sort));

        //Limit ?
        joiner.add("LIMIT " + limit + ";");

        return joiner.toString();
    }

    private String buildSpentAtCondition(
            Sort sort,
            MemberExpense lastRow,
            LocalDate startDate,
            LocalDate endDate
    ) {
        Order spentAtOrder = sort.toList().stream()
                .filter(order -> order.getProperty().equals(MemberExpenseColumn.SPENT_AT.getDbColumn()))
                .findAny()
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_SPENT_AT_ORDER));

        if(spentAtOrder.isAscending()) {
            return greaterThan(MemberExpenseColumn.SPENT_AT, lastRow.getSpentAt().toString())
                    + " AND "
                    + lessOrEqualThan(MemberExpenseColumn.SPENT_AT, endDate.toString());
        }
        return greaterOrEqualThan(MemberExpenseColumn.SPENT_AT, startDate.toString())
                + " AND "
                + lessThan(MemberExpenseColumn.SPENT_AT, lastRow.getSpentAt().toString());
    }

    private String toOrderByClause(Sort sort) {
        if (sort == null || sort.isUnsorted()) {
            return " ";
        }

        return sort.stream()
                .map(order -> order.getProperty() + " " + order.getDirection().name())
                .collect(Collectors.joining(", ", " ORDER BY ", " "));
    }

    private String getCondition(List<Order> orders, MemberExpense lastRow) {
        StringJoiner joiner = new StringJoiner(" AND ");
        for (int i = 0; i < orders.size() - 1; i++) {
            MemberExpenseColumn column = MemberExpenseColumn.fromDbColumn(orders.get(i).getProperty());
            joiner.add(equalsWith(column, column.getLastRowField(lastRow)));
        }

        Order lastOrder = orders.get(orders.size() - 1);
        MemberExpenseColumn lastOrderColumn = MemberExpenseColumn.fromDbColumn(lastOrder.getProperty());
        if (lastOrder.isAscending()) {
            joiner.add(greaterThan(lastOrderColumn, lastOrderColumn.getLastRowField(lastRow)));
        }

        if (lastOrder.isDescending()) {
            joiner.add(lessThan(lastOrderColumn, lastOrderColumn.getLastRowField(lastRow)));
        }

        return joiner.toString();
    }

    private String equalsWith(MemberExpenseColumn column, String value) {
        return column.getDbColumn() + " = '" + value + "'";
    }

    private String greaterThan(MemberExpenseColumn column, String value) {
        return column.getDbColumn() + " > '" + value + "'";
    }

    private String greaterOrEqualThan(MemberExpenseColumn column, String value) {
        return column.getDbColumn() + " >= '" + value + "'";
    }

    private String lessThan(MemberExpenseColumn column, String value) {
        return column.getDbColumn() + " < '" + value + "'";
    }

    private String lessOrEqualThan(MemberExpenseColumn column, String value) {
        return column.getDbColumn() + " <= '" + value + "'";
    }
}
