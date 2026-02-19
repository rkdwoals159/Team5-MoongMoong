package com.moong.dto.response.memberexpense;

import com.moong.domain.entity.Member;

public record MemberExpenseStatics(
        Member member,
        long totalAmount
) {

}
