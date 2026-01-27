package com.moong.repository;

import com.moong.domain.entity.PetGroup;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.util.Optional;
import org.springframework.data.repository.Repository;

public interface PetGroupRepository extends Repository<PetGroup, Long> {

    PetGroup save(PetGroup petGroup);

    Optional<PetGroup> findById(long groupId);

    Optional<PetGroup> findByPetId(long petId);

    void deleteById(long id);

    default PetGroup getById(long decodedGroupId) {
        return findById(decodedGroupId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PET_GROUP_NOT_FOUND));
    }
}
