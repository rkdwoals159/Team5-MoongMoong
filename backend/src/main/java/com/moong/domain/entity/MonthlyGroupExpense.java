package com.moong.domain.entity;


import com.moong.domain.report.MonthlyExpense;
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
import java.time.YearMonth;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "monthly_group_expense")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class MonthlyGroupExpense implements MonthlyExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "expense_year")
    private int expenseYear;

    @Column(name = "expense_month")
    private int expenseMonth;

    @Column(name = "total_amount")
    private long totalAmount;

    @Column(name = "group_id")
    private long petGroupId;

    public MonthlyGroupExpense(YearMonth yearMonth, long totalAmount, long petGroupId) {
        this(null, yearMonth.getYear(), yearMonth.getMonthValue(), totalAmount, petGroupId);
    }

    public long getAverageDailyAmount() {
        return totalAmount / YearMonth.of(expenseYear, expenseMonth).lengthOfMonth();
    }
}
