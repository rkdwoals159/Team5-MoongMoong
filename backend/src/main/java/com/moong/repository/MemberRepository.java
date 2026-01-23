package com.moong.repository;


import com.moong.domain.entity.Member;
import java.util.Optional;
import org.springframework.data.repository.Repository;

public interface MemberRepository extends Repository<Member, Long> {

    Optional<Member> findById(long memberId);

    Member save(Member member);
}
