package com.moong.repository.petgroup;

import com.moong.domain.petgroup.PetGroup;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PetGroupRepository extends Repository<PetGroup, Long> {

    PetGroup save(PetGroup petGroup);

    Optional<PetGroup> findById(long groupId);

    default PetGroup getById(long decodedGroupId) {
        return findById(decodedGroupId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PET_GROUP_NOT_FOUND));
    }

    long count();

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

    @Query("""
            select pg
            from PetGroup pg
            join fetch pg.pet
            where pg.id = :groupId
            """)
    Optional<PetGroup> findFetchedPetById(long groupId);

    default PetGroup getFetchedPetById(long groupId) {
        return findFetchedPetById(groupId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PET_GROUP_NOT_FOUND));
    }

    void deleteById(long id);

    List<PetGroup> findAll();
}
