package com.moong.repository;

import com.moong.domain.entity.Crew;
import java.util.Optional;
import org.springframework.data.repository.Repository;

public interface CrewRepository extends Repository<Crew, Long> {

    Crew save(Crew crew);

    Optional<Crew> findByMemberId(long memberId);
}
