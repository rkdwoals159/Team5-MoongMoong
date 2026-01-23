package com.moong.repository;

import com.moong.domain.entity.Pet;
import java.util.Optional;
import org.springframework.data.repository.Repository;

public interface PetRepository extends Repository<Pet, Long> {

    Pet save(Pet pet);

    Optional<Pet> findById(long id);
}
