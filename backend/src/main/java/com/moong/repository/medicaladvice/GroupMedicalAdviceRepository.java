package com.moong.repository.medicaladvice;

import com.moong.domain.entity.GroupMedicalAdvice;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GroupMedicalAdviceRepository extends Repository<GroupMedicalAdvice, Long> {

    GroupMedicalAdvice save(GroupMedicalAdvice groupMedicalAdvice);

    Optional<GroupMedicalAdvice> findByPetGroup_Id(@Param("groupId") long groupId);

    default GroupMedicalAdvice getByPetGroup_Id(long groupId) {
        return findByPetGroup_Id(groupId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEDICAL_ADVICE_NOT_FOUND));
    }
}
