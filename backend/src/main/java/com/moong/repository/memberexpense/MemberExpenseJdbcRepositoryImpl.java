package com.moong.repository.memberexpense;

import com.moong.domain.entity.MemberExpense;
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
public class MemberExpenseJdbcRepositoryImpl implements MemberExpenseJdbcRepository {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final EntityManager entityManager;

    @Override
    @Transactional
    public void saveAllByBulkQuery(List<MemberExpense> memberExpenses) {
        LocalDateTime now = LocalDateTime.now();

        SqlParameterSource[] parameterSources = memberExpenses.stream()
                .map((memberExpense) -> makeInsertParameterSource(memberExpense, now))
                .toArray(SqlParameterSource[]::new);

        String insertSql = """
                INSERT INTO member_expense (spent_at, usage, cost, main_category, sub_category, memo, modified_at, member_id)
                VALUES (:spentAt, :usage, :cost, :mainCategory, :subCategory, :memo, :modifiedAt, :memberId)
                """;
        entityManager.flush();
        namedParameterJdbcTemplate.batchUpdate(insertSql, parameterSources);
        entityManager.clear();
    }

    private SqlParameterSource makeInsertParameterSource(MemberExpense memberExpense, LocalDateTime now) {
        return new MapSqlParameterSource()
                .addValue("spentAt", memberExpense.getSpentAt())
                .addValue("usage", memberExpense.getUsage())
                .addValue("cost", memberExpense.getCost())
                .addValue("mainCategory", memberExpense.getMainCategory())
                .addValue("subCategory", memberExpense.getSubCategory())
                .addValue("memo", memberExpense.getMemo())
                .addValue("modifiedAt", now)
                .addValue("memberId", memberExpense.getMember().getId());
    }

    @Override
    @Transactional
    public void updateAllByBulkQuery(List<MemberExpense> memberExpenses) {
        LocalDateTime now = LocalDateTime.now();

        SqlParameterSource[] parameterSources = memberExpenses.stream()
                .map((memberExpense) -> makeUpdateParameterSource(memberExpense, now))
                .toArray(SqlParameterSource[]::new);

        String updateSql = """
                UPDATE member_expense SET
                    spent_at = :spentAt,
                    usage = :usage,
                    cost = :cost,
                    main_category = :mainCategory,
                    sub_category = :subCategory,
                    memo = :memo,
                    modified_at = :modifiedAt
                WHERE id = :id
                """;

        entityManager.flush();
        namedParameterJdbcTemplate.batchUpdate(updateSql, parameterSources);
        entityManager.clear();
    }

    private SqlParameterSource makeUpdateParameterSource(MemberExpense memberExpense, LocalDateTime now) {
        return new MapSqlParameterSource()
                .addValue("spentAt", memberExpense.getSpentAt())
                .addValue("usage", memberExpense.getUsage())
                .addValue("cost", memberExpense.getCost())
                .addValue("mainCategory", memberExpense.getMainCategory())
                .addValue("subCategory", memberExpense.getSubCategory())
                .addValue("memo", memberExpense.getMemo())
                .addValue("modifiedAt", now)
                .addValue("id", memberExpense.getId());
    }
}
