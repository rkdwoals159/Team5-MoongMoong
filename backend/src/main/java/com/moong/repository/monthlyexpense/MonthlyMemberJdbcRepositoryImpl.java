package com.moong.repository.monthlyexpense;

import com.moong.domain.report.MonthlyMemberExpense;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class MonthlyMemberJdbcRepositoryImpl implements MonthlyMemberJdbcRepository {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final EntityManager entityManager;

    @Override
    @Transactional
    public void saveAllByBulkQuery(List<MonthlyMemberExpense> monthlyMemberExpenses) {
        SqlParameterSource[] parameterSources = monthlyMemberExpenses.stream()
                .map(this::makeInsertParameterSource)
                .toArray(SqlParameterSource[]::new);

        String insertSql = """
                INSERT INTO monthly_member_expense (member_id, expense_year, expense_month, total_amount)
                VALUES (:memberId, :expenseYear, :expenseMonth, :totalAmount)
                """;
        entityManager.flush();
        namedParameterJdbcTemplate.batchUpdate(insertSql, parameterSources);
        entityManager.clear();
    }

    private SqlParameterSource makeInsertParameterSource(MonthlyMemberExpense monthlyMemberExpense) {
        return new MapSqlParameterSource()
                .addValue("totalAmount", monthlyMemberExpense.getTotalAmount())
                .addValue("memberId", monthlyMemberExpense.getMember().getId())
                .addValue("expenseYear", monthlyMemberExpense.getExpenseYear())
                .addValue("expenseMonth", monthlyMemberExpense.getExpenseMonth());
    }
}
