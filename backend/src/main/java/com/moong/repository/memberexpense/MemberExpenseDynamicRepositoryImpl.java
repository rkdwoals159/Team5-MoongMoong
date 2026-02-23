package com.moong.repository.memberexpense;

import com.moong.domain.member.Member;
import com.moong.domain.memberexpense.MemberExpense;
import com.moong.domain.enums.MainCategoryType;
import com.moong.util.query.MemberExpenseDynamicQueryBuilder;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class MemberExpenseDynamicRepositoryImpl implements MemberExpenseDynamicRepository {

    private final JdbcTemplate jdbcTemplate;
    private final MemberExpenseDynamicQueryBuilder queryBuilder;

    @Override
    public List<MemberExpense> findByLastRowAndCondition(
            LocalDate startDate,
            LocalDate endDate,
            Member member,
            MemberExpense lastRow,
            MainCategoryType mainCategory,
            Sort sort,
            int limit
    ) {
        String query = queryBuilder.buildDynamicQueryWithLastRow(
                lastRow,
                startDate,
                endDate,
                mainCategory,
                member.getId(),
                sort,
                limit
        );
        return jdbcTemplate.query(query, new MemberExpenseRowMapper(member));
    }

    @Override
    public List<MemberExpense> findByCondition(
            LocalDate startDate,
            LocalDate endDate,
            Member member,
            MainCategoryType mainCategory,
            Sort sort,
            int limit
    ) {
        String query = queryBuilder.buildFirstDynamicQuery(startDate, endDate, mainCategory, member.getId(), sort, limit);
        return jdbcTemplate.query(query, new MemberExpenseRowMapper(member));
    }
}
