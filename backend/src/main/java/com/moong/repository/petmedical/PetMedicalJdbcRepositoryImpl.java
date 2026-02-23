package com.moong.repository.petmedical;

import com.moong.domain.petmedical.PetMedical;
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
public class PetMedicalJdbcRepositoryImpl implements PetMedicalJdbcRepository {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final EntityManager entityManager;

    @Override
    @Transactional
    public void saveAllByBulkQuery(List<PetMedical> petMedicals) {
        LocalDateTime now = LocalDateTime.now();
        SqlParameterSource[] parameterSources = petMedicals.stream()
                .map(medical -> makeInsertParameterSource(medical, now))
                .toArray(SqlParameterSource[]::new);

        String insertSql = """
                INSERT INTO pet_medical (breed, age, gender, disease, ratio, created_at, modified_at)
                VALUES (:breed, :age, :gender, :disease, :ratio, :created_at, :modified_at)
                """;
        entityManager.flush();
        namedParameterJdbcTemplate.batchUpdate(insertSql, parameterSources);
        entityManager.clear();
    }

    private SqlParameterSource makeInsertParameterSource(PetMedical petMedical, LocalDateTime now) {
        return new MapSqlParameterSource()
                .addValue("breed", petMedical.getBreed().name())
                .addValue("age", petMedical.getAge())
                .addValue("gender", petMedical.getGender().name())
                .addValue("disease", petMedical.getDisease().name())
                .addValue("ratio", petMedical.getRatio())
                .addValue("created_at", now)
                .addValue("modified_at", now);
    }
}
