package com.moong.repository;

import com.moong.domain.entity.PetGroup;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface PetGroupRepository extends Repository<PetGroup, Long> {

    PetGroup save(PetGroup petGroup);

    Optional<PetGroup> findById(long groupId);

    Optional<PetGroup> findByPetId(long petId);

    default PetGroup getById(long decodedGroupId) {
        return findById(decodedGroupId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PET_GROUP_NOT_FOUND));
    }

    @Query("""
            SELECT pg
             FROM PetGroup pg
             JOIN FETCH pg.pet
             WHERE pg.pet.id=:petId
            """)
    Optional<PetGroup> findFetchedPetByPetId(@Param(value = "petId") long petId);

    default PetGroup getFetchedPetByPetId(long petId) {
        return findFetchedPetByPetId(petId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PET_GROUP_NOT_FOUND));
    }

    void deleteById(long id);
}
