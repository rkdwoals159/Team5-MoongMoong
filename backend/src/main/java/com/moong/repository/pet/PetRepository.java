package com.moong.repository.pet;

import com.moong.domain.pet.Pet;
import java.util.Optional;
import org.springframework.data.repository.Repository;

public interface PetRepository extends Repository<Pet, Long> {

    Pet save(Pet pet);

    Optional<Pet> findById(long id);
}
