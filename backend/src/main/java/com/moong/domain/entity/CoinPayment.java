package com.moong.domain.entity;

import com.moong.domain.enums.PaymentStatus;
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
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "coin_payment")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CoinPayment {

    public static final long MIN_PAYMENT_AMOUNT = 100;
    public static final long MAX_PAYMENT_AMOUNT = 1_000_000;

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    private long amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crew_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Crew crew;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PaymentStatus paymentStatus;

    public CoinPayment(UUID id, long amount, Crew crew, PaymentStatus paymentStatus) {
        validateAmount(amount);
        this.id = id;
        this.amount = amount;
        this.crew = crew;
        this.paymentStatus = paymentStatus;
    }

    private void validateAmount(long amount) {
        if(amount < MIN_PAYMENT_AMOUNT || amount > MAX_PAYMENT_AMOUNT) {
            throw new BusinessException(ErrorCode.INVALID_PAYMENT_AMOUNT);
        }
    }

    public boolean hasStatus(PaymentStatus status) {
        return this.paymentStatus == status;
    }

    public boolean hasSameAmount(long amount) {
        return this.amount == amount;
    }
}
