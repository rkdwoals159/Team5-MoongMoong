package com.moong.repository.medicaladvice;

import com.moong.domain.medicaladvice.AiMedicalAdvice;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class GroupMedicalAdviceJdbcRepositoryImpl implements GroupMedicalAdviceJdbcRepository{

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final EntityManager entityManager;

    @Override
    public void upsertAllByBulkQuery(List<AiMedicalAdvice> aiMedicalAdvices) {
        SqlParameterSource[] parameterSources = aiMedicalAdvices.stream()
                .map(this::makeUpsertParameterSource)
                .toArray(SqlParameterSource[]::new);

        String upsertSql = """
            INSERT INTO group_medical_advice (group_id, advice, expected_cost, year)
            VALUES (:groupId, :advice, :expectedCost, :year)
            ON DUPLICATE KEY UPDATE
              advice = VALUES(advice),
              expected_cost = VALUES(expected_cost),
              advice_year = VALUES(year),
            """;

        entityManager.flush();
        namedParameterJdbcTemplate.batchUpdate(upsertSql, parameterSources);
        entityManager.clear();
    }

    private SqlParameterSource makeUpsertParameterSource(AiMedicalAdvice advice) {
        return new MapSqlParameterSource()
                .addValue("groupId", advice.getGroupId())
                .addValue("advice", advice.getMedicalAdvice())
                .addValue("expectedCost", advice.getExpectedCost())
                .addValue("year", advice.getNextYear());
    }
}
