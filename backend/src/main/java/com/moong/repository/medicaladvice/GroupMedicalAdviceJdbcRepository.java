package com.moong.repository.medicaladvice;

import com.moong.domain.medicaladvice.AiMedicalAdvice;

import java.util.List;

public interface GroupMedicalAdviceJdbcRepository {

    void upsertAllByBulkQuery(List<AiMedicalAdvice> aiMedicalAdvices);
}
