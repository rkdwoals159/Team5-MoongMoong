package com.moong.domain.bank;

import com.moong.domain.entity.BaseEntity;
import com.moong.domain.petgroup.PetGroup;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
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
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "bank",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_bank_group",
                        columnNames = {"group_id"}
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Bank extends BaseEntity {

    private static final long MAX_TARGET_AMOUNT = 10_000_000L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private PetGroup petGroup;

    private long targetAmount;

    private long currentAmount;

    public Bank(PetGroup petGroup, long targetAmount) {
        validateTargetAmount(targetAmount);
        this.petGroup = petGroup;
        this.targetAmount = targetAmount;
        this.currentAmount = 0L;
    }

    public void updateCurrentAmount(long amount) {
        if (amount <= 0L) throw new BusinessException(ErrorCode.BANK_SAVING_BELOW_ZERO);
        if (isSucceedTargetAmount()) throw new BusinessException(ErrorCode.ALREADY_SUCCEED_BANK_TARGET_AMOUNT);

        currentAmount += amount;
    }

    public boolean isSucceedTargetAmount() {
        return currentAmount >= targetAmount;
    }

    public void updateTargetAmount(long targetAmount) {
        validateTargetAmount(targetAmount);

        if (targetAmount < currentAmount) {
            throw new BusinessException(ErrorCode.BANK_TARGET_LESS_THAN_CURRENT);
        }

        this.targetAmount = targetAmount;
    }

    public boolean isCurrentAmountZero() {
        return currentAmount == 0L;
    }

    private void validateTargetAmount(long target) {
        if (target <= 0L) throw new BusinessException(ErrorCode.BANK_TARGET_BELOW_ZERO);
        if (target > MAX_TARGET_AMOUNT) throw new BusinessException(ErrorCode.BANK_TARGET_EXCEED_LIMIT);
    }
}
