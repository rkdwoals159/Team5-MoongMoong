package com.moong.repository.groupexpense;

import com.moong.domain.entity.GroupExpense;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class GroupExpenseJdbcRepositoryImpl implements GroupExpenseJdbcRepository {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final EntityManager entityManager;

    @Override
    @Transactional
    public void saveAllByBulkQuery(List<GroupExpense> groupExpenses) {
        SqlParameterSource[] parameterSources = groupExpenses.stream()
                .map(this::makeInsertParameterSource)
                .toArray(SqlParameterSource[]::new);

        String insertSql = """
                INSERT INTO group_expense (member_expense_id, group_id, created_at, modified_at)
                VALUES (:memberExpenseId, :groupId, :createdAt, :modifiedAt)
                """;
        entityManager.flush();
        namedParameterJdbcTemplate.batchUpdate(insertSql, parameterSources);
        entityManager.clear();
    }

    private SqlParameterSource makeInsertParameterSource(GroupExpense groupExpense) {
        LocalDateTime now = LocalDateTime.now();
        return new MapSqlParameterSource()
                .addValue("memberExpenseId", groupExpense.getMemberExpense().getId())
                .addValue("groupId", groupExpense.getPetGroup().getId())
                .addValue("createdAt", now)
                .addValue("modifiedAt", now);
    }
}

