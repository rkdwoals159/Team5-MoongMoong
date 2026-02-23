package com.moong.repository.member;


import com.moong.domain.member.Member;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface MemberRepository extends Repository<Member, Long> {

    Optional<Member> findById(long memberId);

    default Member getById(Long id) {
        return findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
    }

    Optional<Member> findByEmail(String email);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("update Member m set m.name = :name where m.id = :memberId")
    void updateMemberName(
            @Param(value = "memberId") long memberId,
            @Param(value = "name") String name
    );

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("update Member m set m.imageUrl = :imageUrl where m.id = :memberId")
    void updateProfile(
            @Param(value = "memberId") long memberId,
            @Param(value = "imageUrl") String imageUrl
    );

    Member save(Member member);

    boolean existsByName(String name);

}
