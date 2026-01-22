package com.moong.domain.entity;

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
@Table(name = "treatment")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Treatment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Disease disease;

    @NotNull
    @Column(length = 50)
    private String name;

    @NotNull
    @Column(length = 100)
    private String description;

    @NotNull
    @Column(length = 20)
    private String city;

    @Column(length = 20)
    private String district;

    @Column(name = "min_price")
    private int minPrice;

    @Column(name = "average_price")
    private int averagePrice;

    @Column(name = "max_price")
    private int maxPrice;
}
