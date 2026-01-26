package com.moong.repository;

import com.moong.domain.entity.GroupExpense;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface GroupExpenseRepository extends Repository<GroupExpense, Long> {

    GroupExpense save(GroupExpense groupExpense);

    @Query("""
            select groupExpense
                from GroupExpense groupExpense
                where groupExpense.spentAt >= :startDate
                  and groupExpense.spentAt <= :endDate
                  and groupExpense.petGroup.id = :groupId
            """)
    List<GroupExpense> findByPeriod(
            @Param(value = "groupId") long groupId,
            @Param(value = "startDate") LocalDate startDate,
            @Param(value = "endDate") LocalDate endDate,
            Sort sort
    );
}
