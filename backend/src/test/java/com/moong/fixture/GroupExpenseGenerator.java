package com.moong.fixture;

import com.moong.domain.groupexpense.GroupExpense;
import com.moong.domain.memberexpense.MemberExpense;
import com.moong.domain.petgroup.PetGroup;
import com.moong.repository.groupexpense.GroupExpenseRepository;
import org.springframework.stereotype.Component;

@Component
public class GroupExpenseGenerator {

    private final GroupExpenseRepository groupExpenseRepository;

    public GroupExpenseGenerator(GroupExpenseRepository groupExpenseRepository) {
        this.groupExpenseRepository = groupExpenseRepository;
    }

    public GroupExpense generateSaved(
            PetGroup petGroup,
            MemberExpense memberExpense
    ) {
        GroupExpense expense = new GroupExpense(
                null,
                memberExpense,
                petGroup
        );
        return groupExpenseRepository.save(expense);
    }
}
