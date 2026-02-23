package com.moong.repository.medicaladvice;

import com.moong.domain.groupmedical.GroupMedicalAdvice;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import org.springframework.data.repository.Repository;

import java.util.Optional;

public interface GroupMedicalAdviceRepository extends Repository<GroupMedicalAdvice, Long> {

    GroupMedicalAdvice save(GroupMedicalAdvice groupMedicalAdvice);

    Optional<GroupMedicalAdvice> findByPetGroup_Id(long groupId);

    default GroupMedicalAdvice getByPetGroup_Id(long groupId) {
        return findByPetGroup_Id(groupId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEDICAL_ADVICE_NOT_FOUND));
    }

    void deleteByPetGroup_Id(long groupId);
}
