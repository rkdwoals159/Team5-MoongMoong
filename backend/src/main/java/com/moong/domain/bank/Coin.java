package com.moong.domain.bank;

import com.moong.domain.entity.BaseEntity;
import com.moong.domain.crew.Crew;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "coin")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Coin extends BaseEntity {

    public static final String CREATED_AT_COLUMN_NAME = "createdAt";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Bank bank;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crew_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Crew crew;

    private long amount;

    public Coin(Bank bank, Crew crew, long amount) {
        this(null, bank, crew, amount);
    }
}
