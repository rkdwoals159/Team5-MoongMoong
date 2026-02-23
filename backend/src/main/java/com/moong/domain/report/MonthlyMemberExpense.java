package com.moong.domain.report;

import com.moong.domain.member.Member;
import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.YearMonth;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "monthly_member_expense")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class MonthlyMemberExpense implements MonthlyExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "expense_year")
    private int expenseYear;

    @Column(name = "expense_month")
    private int expenseMonth;

    @Column(name = "total_amount")
    private long totalAmount;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Member member;

    public MonthlyMemberExpense(YearMonth yearMonth, long totalAmount, Member member) {
        this.expenseYear = yearMonth.getYear();
        this.expenseMonth = yearMonth.getMonthValue();
        this.totalAmount = totalAmount;
        this.member = member;
    }

    public long getDailyAverageAmount() {
        return totalAmount / YearMonth.of(expenseYear, expenseMonth).lengthOfMonth();
    }
}
