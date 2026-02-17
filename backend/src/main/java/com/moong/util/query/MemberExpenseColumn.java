package com.moong.util.query;

import com.moong.domain.entity.MemberExpense;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.util.function.Function;
import java.util.stream.Stream;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MemberExpenseColumn {

    ID("id", "id", MemberExpense::getId),
    MAIN_CATEGORY("mainCategory", "main_category", MemberExpense::getMainCategory),
    SUB_CATEGORY("subCategory", "sub_category", MemberExpense::getSubCategory),
    MEMBER_ID("member_id", "member_id", expense -> expense.getMember().getId()),
    EXPENSE("usage", "expense_usage", MemberExpense::getUsage),
    SPENT_AT("spentAt", "spent_at", MemberExpense::getSpentAt),
    COST("cost", "cost", MemberExpense::getCost),
    MEMO("memo", "memo", MemberExpense::getMemo),
    MODIFIED_AT("modifiedAt", "modified_at", MemberExpense::getModifiedAt),
    ;

    private final String property;
    private final String dbColumn;
    private final Function<MemberExpense, Object> callGetter;

    public static MemberExpenseColumn fromProperty(String property) {
        return Stream.of(values())
                .filter(column -> column.getProperty().equals(property))
                .findAny()
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER_EXPENSE_COLUMN));
    }

    public static MemberExpenseColumn fromDbColumn(String dbColumn) {
        return Stream.of(values())
                .filter(column -> column.getDbColumn().equals(dbColumn))
                .findAny()
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_MEMBER_EXPENSE_COLUMN));
    }

    public String getLastRowField(MemberExpense memberExpense) {
        return callGetter.apply(memberExpense).toString();
    }
}
