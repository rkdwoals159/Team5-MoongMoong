package com.moong.repository;

import com.moong.domain.entity.Crew;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.util.Optional;
import org.springframework.data.repository.Repository;

public interface CrewRepository extends Repository<Crew, Long> {

    Crew save(Crew crew);

    Optional<Crew> findByMemberId(long memberId);

    default Crew getByMemberId(long memberId) {
        return findByMemberId(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CREW_NOT_FOUND));
    }
}
