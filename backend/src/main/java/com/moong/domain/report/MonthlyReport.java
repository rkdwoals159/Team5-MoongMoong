package com.moong.domain.report;

import com.moong.domain.entity.Member;
import java.time.YearMonth;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class MonthlyReport {

    private final String memberName;
    private final String memberEmail;
    private final int reportYear;
    private final int reportMonth;
    private final PersonalStats personal;
    private final GroupStats group;

    public MonthlyReport(Member member, YearMonth yearMonth, PersonalStats personal, GroupStats group) {
        this(
                member.getName(),
                member.getEmail(),
                yearMonth.getYear(),
                yearMonth.getMonthValue(),
                personal,
                group
        );
    }
}
