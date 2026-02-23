package com.moong.dto.response.memberexpense;

import com.moong.domain.member.Member;

public record MemberExpenseStatics(
        Member member,
        long totalAmount
) {

}
