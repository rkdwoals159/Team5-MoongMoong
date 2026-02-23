package com.moong.domain.memberexpense;

import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import com.moong.domain.member.Member;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.YearMonth;

@Entity
@Table(name = "member_expense")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberExpense {

    public static final long MIN_PAYMENT_AMOUNT = 0;
    public static final long MAX_PAYMENT_AMOUNT = 99_999_999;
    public static final long MAX_USAGE_LENGTH = 250;
    public static final long MAX_MEMO_LENGTH = 250;
    public static final String SPENT_AT_COLUMN_NAME = "spentAt";
    public static final String MODIFIED_AT_COLUMN_NAME = "modifiedAt";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "spent_at", nullable = false)
    private LocalDate spentAt;

    @NotNull
    @Column(name = "expense_usage")
    private String usage;

    private long cost;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private MainCategoryType mainCategory;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private SubCategoryType subCategory;

    private String memo;

    @LastModifiedDate
    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Member member;

    public MemberExpense(
            Long id,
            LocalDate spentAt,
            String usage,
            long cost,
            MainCategoryType mainCategory,
            SubCategoryType subCategory,
            String memo,
            LocalDateTime modifiedAt,
            Member member
    ) {
        validateAmount(cost);
        validateUsage(usage);
        validateMemo(memo);
        this.id = id;
        this.spentAt = spentAt;
        this.usage = usage;
        this.cost = cost;
        this.mainCategory = mainCategory;
        this.subCategory = subCategory;
        this.memo = memo;
        this.modifiedAt = modifiedAt;
        this.member = member;
    }

    private void validateUsage(String usage) {
        if(usage != null && usage.length() > MAX_USAGE_LENGTH) {
            throw new BusinessException(ErrorCode.USAGE_LENGTH_EXCEED);
        }
    }

    private void validateMemo(String memo) {
        if(memo != null && memo.length() > MAX_MEMO_LENGTH) {
            throw new BusinessException(ErrorCode.MEMO_LENGTH_EXCEED);
        }
    }

    private void validateAmount(long amount) {
        if (amount > MAX_PAYMENT_AMOUNT || amount < MIN_PAYMENT_AMOUNT) {
            throw new BusinessException(ErrorCode.INVALID_EXPENSE_COST_AMOUNT);
        }
    }

    public String getSubCategoryName() {
        if (this.subCategory != null) {
            return this.subCategory.name();
        }
        return null;
    }

    public Month getSpentAtMonth() {
        return this.spentAt.getMonth();
    }

    public YearMonth getSpentAtYearMonth() {
        return YearMonth.of(spentAt.getYear(), spentAt.getMonthValue());
    }
}
