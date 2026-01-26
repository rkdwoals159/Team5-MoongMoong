package com.moong.service;

import com.moong.domain.entity.Pet;
import com.moong.domain.entity.WorriedDisease;
import com.moong.dto.request.PetCreateRequest;
import com.moong.dto.response.pet.PetCreateResponse;
import com.moong.repository.PetRepository;
import com.moong.repository.WorriedDiseaseRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final WorriedDiseaseRepository worriedDiseaseRepository;

    @Transactional
    public PetCreateResponse createPet(PetCreateRequest petCreateRequest) {
        Pet pet = petCreateRequest.toPet();
        Pet savedPet = petRepository.save(pet);

        List<WorriedDisease> worriedDiseases = petCreateRequest.diseases()
                .stream()
                .map(disease -> new WorriedDisease(disease, pet))
                .toList();
        worriedDiseaseRepository.saveAll(worriedDiseases);
        return new PetCreateResponse(savedPet, worriedDiseases);
    }
}
