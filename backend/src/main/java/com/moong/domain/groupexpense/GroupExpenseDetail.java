package com.moong.domain.groupexpense;

import com.moong.domain.member.Member;
import com.moong.domain.memberexpense.MemberExpense;
import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import lombok.Getter;

@Getter
public class GroupExpenseDetail {

    private final long memberExpenseId;
    private final LocalDate spentAt;
    private final String nickName;
    private final String usage;
    private final long cost;
    private final MainCategoryType mainCategory;
    private final SubCategoryType subCategory;
    private final String memo;
    private final LocalDateTime modifiedAt;

    public GroupExpenseDetail(MemberExpense memberExpense, Member member) {
        this.memberExpenseId = memberExpense.getId();
        this.spentAt = memberExpense.getSpentAt();
        this.nickName = member.getName();
        this.usage = memberExpense.getUsage();
        this.cost = memberExpense.getCost();
        this.mainCategory = memberExpense.getMainCategory();
        this.subCategory = memberExpense.getSubCategory();
        this.memo = memberExpense.getMemo();
        this.modifiedAt = memberExpense.getModifiedAt();
    }

    public YearMonth getSpentAtYearMonth() {
        return YearMonth.of(spentAt.getYear(), spentAt.getMonth());
    }
}
