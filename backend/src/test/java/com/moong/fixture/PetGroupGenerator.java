package com.moong.fixture;

import com.moong.domain.pet.Pet;
import com.moong.domain.petgroup.PetGroup;
import com.moong.repository.petgroup.PetGroupRepository;
import org.springframework.stereotype.Component;

@Component
public class PetGroupGenerator {

    private final PetGroupRepository petGroupRepository;

    public PetGroupGenerator(PetGroupRepository petGroupRepository) {
        this.petGroupRepository = petGroupRepository;
    }

    public PetGroup generateSaved(Pet pet) {
        return petGroupRepository.save(new PetGroup(pet));
    }
}
