package com.moong.repository;

import com.moong.domain.entity.MemberExpense;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

public interface MemberExpenseRepository extends Repository<MemberExpense, Long> {

    MemberExpense save(MemberExpense memberExpense);

    @Query("""
                    select me
                    from MemberExpense me
                    where me.member.id = :memberId
                        and me.spentAt between :startDate and :endDate
            """)
    List<MemberExpense> findByMemberIdAndPeriod(long memberId, LocalDate startDate, LocalDate endDate, Sort sort);
}
