package com.moong.repository;

import com.moong.domain.entity.Pet;
import org.springframework.data.repository.Repository;

import java.util.Optional;

public interface PetRepository extends Repository<Pet, Long> {

    Pet save(Pet pet);

    Optional<Pet> findById(long id);
}
