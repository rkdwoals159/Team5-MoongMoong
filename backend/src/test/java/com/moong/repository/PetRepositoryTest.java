package com.moong.repository;

import com.moong.domain.entity.Pet;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class PetRepositoryTest extends BaseRepositoryTest{

    @Autowired
    private PetRepository petRepository;

    @DisplayName("펫을 저장할 수 있다")
    @Test
    void save() {
        Pet pet = petGenerator.generateUnSaved();
        Pet savedPet = petRepository.save(pet);

        Optional<Pet> foundPet = petRepository.findById(savedPet.getId());

        assertThat(foundPet).isPresent();
    }
}
