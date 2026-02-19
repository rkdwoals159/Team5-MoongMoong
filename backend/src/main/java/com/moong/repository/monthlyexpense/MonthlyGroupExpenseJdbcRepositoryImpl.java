package com.moong.repository.monthlyexpense;

import com.moong.domain.entity.MonthlyGroupExpense;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;

@Slf4j
@Repository
@RequiredArgsConstructor
public class MonthlyGroupExpenseJdbcRepositoryImpl implements MonthlyGroupExpenseJdbcRepository {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final EntityManager entityManager;

    @Override
    @Transactional
    public void saveAllByBulkQuery(List<MonthlyGroupExpense> monthlyGroupExpenses) {
        SqlParameterSource[] parameterSources = monthlyGroupExpenses.stream()
                .map(this::makeInsertParameterSource)
                .toArray(SqlParameterSource[]::new);

        String insertSql = """
                INSERT INTO monthly_group_expense (group_id, expense_year, expense_month, total_amount)
                VALUES (:petGroupId, :expenseYear, :expenseMonth, :totalAmount)
                """;
        entityManager.flush();
        namedParameterJdbcTemplate.batchUpdate(insertSql, parameterSources);
        entityManager.clear();
    }

    private SqlParameterSource makeInsertParameterSource(MonthlyGroupExpense monthlyGroupExpense) {
        return new MapSqlParameterSource()
                .addValue("totalAmount", monthlyGroupExpense.getTotalAmount())
                .addValue("petGroupId", monthlyGroupExpense.getPetGroupId())
                .addValue("expenseYear", monthlyGroupExpense.getExpenseYear())
                .addValue("expenseMonth", monthlyGroupExpense.getExpenseMonth());
    }
}
