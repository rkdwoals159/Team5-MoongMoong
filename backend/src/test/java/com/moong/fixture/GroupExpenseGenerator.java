package com.moong.fixture;

import com.moong.domain.entity.GroupExpense;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.entity.PetGroup;
import com.moong.repository.GroupExpenseRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.stereotype.Component;

@Component
public class GroupExpenseGenerator {

    private final GroupExpenseRepository groupExpenseRepository;

    public GroupExpenseGenerator(GroupExpenseRepository groupExpenseRepository) {
        this.groupExpenseRepository = groupExpenseRepository;
    }

    public GroupExpense generateSaved(
            PetGroup petGroup,
            MemberExpense memberExpense,
            String name
    ) {
        GroupExpense expense = new GroupExpense(
                null,
                memberExpense.getSpentAt(),
                memberExpense.getUsage(),
                memberExpense.getCost(),
                memberExpense,
                memberExpense.getMainCategory(),
                memberExpense.getSubCategory(),
                name,
                "메모",
                memberExpense.getModifiedAt(),
                petGroup
        );
        return groupExpenseRepository.save(expense);
    }
}
