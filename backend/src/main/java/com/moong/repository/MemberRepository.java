package com.moong.repository;


import com.moong.domain.entity.Member;
import java.util.Optional;
import org.springframework.data.repository.Repository;

public interface MemberRepository extends Repository<Member, Long> {

    Optional<Member> findById(long memberId);

    Optional<Member> findByEmail(String email);

    Member save(Member member);

    boolean existsByName(String name);
}
