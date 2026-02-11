package com.moong.repository.memberexpense;

import com.moong.domain.entity.MemberExpense;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface MemberExpenseRepository extends Repository<MemberExpense, Long>, MemberExpenseJdbcRepository {

    MemberExpense save(MemberExpense memberExpense);

    default List<MemberExpense> saveAll(List<MemberExpense> memberExpenses) {
        List<MemberExpense> savedMemberExpenses = new ArrayList<>();
        for (MemberExpense memberExpense : memberExpenses) {
            MemberExpense savedMemberExpense = save(memberExpense);
            savedMemberExpenses.add(savedMemberExpense);
        }
        return savedMemberExpenses;
    }

    Optional<MemberExpense> findById(long id);

    default MemberExpense getById(long id) {
        return findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_EXPENSE_NOT_FOUND));
    }

    List<MemberExpense> findAllByMemberId(Long memberId);

    List<MemberExpense> findByMember_IdAndSpentAtBetween(
            long memberId,
            LocalDate startDate,
            LocalDate endDate,
            Sort sort
    );

    Slice<MemberExpense> findByMember_IdAndSpentAtBetween(
            long memberId,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    );

    Slice<MemberExpense> findByMember_IdAndMainCategoryAndSpentAtBetween(
            long memberId,
            String mainCategory,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    );

    @Query("""
            select coalesce(sum(me.cost), 0)
            from MemberExpense me
            where me.member.id = :memberId
              and me.spentAt between :startDate and :endDate
            """)
    long sumCostByMemberIdAndPeriod(
            @Param("memberId") long memberId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
            select coalesce(sum(me.cost), 0)
            from MemberExpense me
            where me.member.id = :memberId
              and me.mainCategory = :mainCategory
              and me.spentAt between :startDate and :endDate
            """)
    long sumCostByMemberIdAndMainCategoryAndPeriod(
            long memberId,
            String mainCategory,
            LocalDate startDate,
            LocalDate endDate
    );

    @Query("""
            select me
            from MemberExpense me
            where me.id in :ids
            """)
    List<MemberExpense> findAllByIds(List<Long> ids);

    @Query("""
                delete from MemberExpense me
                where me.member.id = :memberId
                    and me.id in :ids
            """)
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    void deleteByMemberIdAndIds(long memberId, List<Long> ids);
}
