package com.moong.domain.entity;

import com.moong.domain.enums.PaymentStatus;
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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "coin_payment")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CoinPayment {

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

    public boolean isReady() {
        return this.paymentStatus == PaymentStatus.READY;
    }

    public boolean isConfirm() {
        return this.paymentStatus == PaymentStatus.CONFIRMED;
    }

    public boolean hasSameAmount(long amount) {
        return this.amount == amount;
    }
}
