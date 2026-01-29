package com.moong.repository;

import com.moong.domain.entity.GroupExpense;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.groupexpense.GroupExpenseDetail;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

public interface GroupExpenseRepository extends Repository<GroupExpense, Long> {

    GroupExpense save(GroupExpense groupExpense);

    @Query("""
            select ge
            from GroupExpense ge
            join fetch ge.memberExpense me
            join fetch me.member
            where ge.petGroup.id = :groupId
              and me.spentAt between :startDate and :endDate
            """)
    List<GroupExpense> findFetchedByGroupIdAndPeriod(
            @Param(value = "groupId") long groupId,
            @Param(value = "startDate") LocalDate startDate,
            @Param(value = "endDate") LocalDate endDate,
            Sort sort
    );

    @Query("""
            select ge
            from GroupExpense ge
            join fetch ge.memberExpense me
            join fetch me.member
            where ge.petGroup.id = :groupId
              and me.mainCategory = :mainCategory
              and me.spentAt between :startDate and :endDate
            """)
    List<GroupExpense> findFetchedByPetGroupIdAndMainCategoryAndPeriod(
            @Param(value = "groupId") long petGroupId,
            @Param(value = "mainCategory") String mainCategory,
            @Param(value = "startDate") LocalDate startDate,
            @Param(value = "endDate") LocalDate endDate,
            Sort sort
    );

    default List<GroupExpenseDetail> getFetchedByGroupIdAndPeriod(
            long groupId,
            LocalDate start,
            LocalDate end,
            Sort sort
    ) {
        return convertFetchedToDetails(findFetchedByGroupIdAndPeriod(groupId, start, end, sort));
    }

    default List<GroupExpenseDetail> getFetchedByPetGroupIdAndMainCategoryAndPeriod(
            long groupId,
            String category,
            LocalDate start,
            LocalDate end,
            Sort sort
    ) {
        List<GroupExpense> groupExpenses =
                findFetchedByPetGroupIdAndMainCategoryAndPeriod(
                        groupId,
                        category,
                        start,
                        end,
                        sort
                );
        return convertFetchedToDetails(groupExpenses);
    }

    private List<GroupExpenseDetail> convertFetchedToDetails(List<GroupExpense> groupExpenses) {
        return groupExpenses.stream()
                .map(groupExpense -> {
                    MemberExpense memberExpense = groupExpense.getMemberExpense();
                    return new GroupExpenseDetail(memberExpense, memberExpense.getMember());
                })
                .toList();
    }
}
