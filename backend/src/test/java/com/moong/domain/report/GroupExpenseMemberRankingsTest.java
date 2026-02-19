package com.moong.domain.report;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MonthlyMemberExpense;
import com.moong.util.MemberNameGenerator;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class GroupExpenseMemberRankingsTest {

    private final MemberNameGenerator memberNameGenerator = new MemberNameGenerator();

    @DisplayName("그룹 내 회원의 소비 랭킹을 상위 3개로 비용 내림차순 정렬하여 가진다")
    @Test
    void groupExpenseMemberRankingsTest() {
        Member member1 = generateMember(1L);
        Member member2 = generateMember(2L);
        Member member3 = generateMember(3L);
        Member member4 = generateMember(4L);
        List<MonthlyMemberExpense> monthlyMemberExpenses = List.of(
                new MonthlyMemberExpense(1L, 2026, 3, 1000, member1),
                new MonthlyMemberExpense(1L, 2026, 3, 2000, member2),
                new MonthlyMemberExpense(1L, 2026, 3, 3000, member3),
                new MonthlyMemberExpense(1L, 2026, 3, 4000, member4)
        );

        GroupExpenseMemberRankings rankings = GroupExpenseMemberRankings.fromMonthlyExpense(monthlyMemberExpenses);

        assertThat(rankings.getValues())
                .extracting(GroupExpenseMemberRanking::name)
                .containsExactly(member4.getName(), member3.getName(), member2.getName());
    }

    private Member generateMember(long id) {
        return new Member(
                id,
                "email" + id + "@email.com",
                memberNameGenerator.generateUniqueNameWithDecorator((s) -> false).getValue(),
                "imageUrl" + id
        );
    }


}
