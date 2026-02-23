package com.moong.repository.memberexpense;

import com.moong.domain.member.Member;
import com.moong.domain.memberexpense.MemberExpense;
import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.util.query.MemberExpenseColumn;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.RowMapper;

@RequiredArgsConstructor
public class MemberExpenseRowMapper implements RowMapper<MemberExpense> {

    private final Member member;

    @Override
    public MemberExpense mapRow(ResultSet rs, int rowNum) {
        try {
            return new MemberExpense(
                    rs.getLong(MemberExpenseColumn.ID.getDbColumn()),
                    rs.getObject(MemberExpenseColumn.SPENT_AT.getDbColumn(), LocalDate.class),
                    rs.getString(MemberExpenseColumn.EXPENSE.getDbColumn()),
                    rs.getLong(MemberExpenseColumn.COST.getDbColumn()),
                    MainCategoryType.valueOf(rs.getString(MemberExpenseColumn.MAIN_CATEGORY.getDbColumn())),
                    getSubCategory(rs),
                    rs.getString(MemberExpenseColumn.MEMO.getDbColumn()),
                    rs.getObject(MemberExpenseColumn.MODIFIED_AT.getDbColumn(), LocalDateTime.class),
                    member
            );
        } catch (SQLException exception) {
            throw new BusinessException(ErrorCode.MEMBER_EXPENSE_ROW_MAPPING_ERROR);
        }
    }

    private SubCategoryType getSubCategory(ResultSet rs) throws SQLException {
        if (rs.getString(MemberExpenseColumn.SUB_CATEGORY.getDbColumn()) != null) {
            return SubCategoryType.valueOf(rs.getString(MemberExpenseColumn.SUB_CATEGORY.getDbColumn()));
        }
        return null;
    }
}


