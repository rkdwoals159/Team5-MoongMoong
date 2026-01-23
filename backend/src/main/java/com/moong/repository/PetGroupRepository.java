package com.moong.repository;

import com.moong.domain.entity.PetGroup;
import java.util.Optional;
import org.springframework.data.repository.Repository;

public interface PetGroupRepository extends Repository<PetGroup, Long> {

    PetGroup save(PetGroup petGroup);

    Optional<PetGroup> findById(long groupId);

}
