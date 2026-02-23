package com.moong.domain.pet;

import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Gender;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    public String getName() {
        return name.trim(); 
    }
  
    public PetAge getAge() {
        return new PetAge(birthDate);
    }

    public void updateInfo(
            String name,
            Breed breed,
            Gender gender,
            LocalDate birthDate,
            String city,
            String district
    ) {
        this.name = name;
        this.breed = breed;
        this.gender = gender;
        this.birthDate = birthDate;
        this.city = city;
        this.district = district;
    }
}
