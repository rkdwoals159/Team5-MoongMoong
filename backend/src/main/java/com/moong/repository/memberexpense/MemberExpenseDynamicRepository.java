package com.moong.repository.memberexpense;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.enums.MainCategoryType;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Sort;

public interface MemberExpenseDynamicRepository {

    List<MemberExpense> findByLastRowAndCondition(
            LocalDate startDate,
            LocalDate endDate,
            Member member,
            MemberExpense lastRow,
            MainCategoryType mainCategory,
            Sort sort,
            int limit
    );

    List<MemberExpense> findByCondition(
            LocalDate startDate,
            LocalDate endDate,
            Member member,
            MainCategoryType mainCategory,
            Sort sort,
            int limit
    );
}
