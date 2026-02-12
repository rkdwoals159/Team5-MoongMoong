package com.moong.repository;

import com.moong.domain.entity.Crew;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

public interface CrewRepository extends Repository<Crew, Long> {

    Crew save(Crew crew);

    Optional<Crew> findByMemberId(long memberId);

    List<Crew> findAllByPetGroup_Id(long groupId);

    default Crew getByMemberId(long memberId) {
        return findByMemberId(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CREW_NOT_FOUND));
    }

    @Query("""
            select c from Crew c
            join fetch c.petGroup pg
            join fetch pg.pet
            where c.member.id = :memberId
            """)
    Optional<Crew> findFetchedByMemberId(long memberId);

    default Crew getFetchedByMemberId(long memberId) {
        return findFetchedByMemberId(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CREW_NOT_FOUND));
    }

    long countByPetGroup_Id(long petGroupId);

    void deleteById(long id);
}
