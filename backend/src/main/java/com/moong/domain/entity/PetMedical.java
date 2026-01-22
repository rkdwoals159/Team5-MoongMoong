package com.moong.domain.entity;

import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pet_medical")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PetMedical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private Breed breed;

    private int age;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Disease disease;

    private int ratio;
}
