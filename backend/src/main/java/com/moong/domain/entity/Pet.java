package com.moong.domain.entity;

import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Gender;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.Period;
import java.time.ZoneId;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "pet")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(columnDefinition = "char(20)")
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private Breed breed;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Gender gender;

    @NotNull
    @Column(name = "birth_date")
    private LocalDate birthDate;

    @NotNull
    @Column(length = 20)
    private String city;

    @Column(length = 20)
    private String district;
}
