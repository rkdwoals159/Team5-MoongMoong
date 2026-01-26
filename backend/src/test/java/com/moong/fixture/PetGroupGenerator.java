package com.moong.fixture;

import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.repository.PetGroupRepository;
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
