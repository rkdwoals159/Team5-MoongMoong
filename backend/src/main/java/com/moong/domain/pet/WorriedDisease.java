package com.moong.domain.pet;

import com.moong.domain.enums.Disease;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "worried_disease")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class WorriedDisease {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Disease disease;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Pet pet;

    public WorriedDisease(Disease disease, Pet pet) {
        this(null, disease, pet);
    }
}
