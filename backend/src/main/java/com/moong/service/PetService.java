package com.moong.service;

import com.moong.domain.entity.Pet;
import com.moong.domain.entity.WorriedDisease;
import com.moong.domain.enums.Disease;
import com.moong.dto.request.PetCreateRequest;
import com.moong.dto.response.PetCreateResponse;
import com.moong.repository.PetRepository;
import com.moong.repository.WorriedDiseaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final WorriedDiseaseRepository worriedDiseaseRepository;

    public PetCreateResponse createPet(PetCreateRequest petCreateRequest) {
        Pet pet = petCreateRequest.toPet();
        Pet savedPet = petRepository.save(pet);

        List<Disease> diseaseList = petCreateRequest.getDiseases();
        List<WorriedDisease> worriedDiseases = new ArrayList<>();
        for(Disease disease : diseaseList){
            WorriedDisease worriedDisease = new WorriedDisease(null, disease, pet);
            worriedDiseases.add(worriedDisease);
        }

        worriedDiseaseRepository.saveAll(worriedDiseases);
        return new PetCreateResponse(savedPet, worriedDiseases);
    }
}
