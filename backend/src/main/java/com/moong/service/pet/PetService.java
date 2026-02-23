package com.moong.service.pet;

import com.moong.domain.crew.Crew;
import com.moong.domain.member.Member;
import com.moong.domain.pet.Pet;
import com.moong.domain.pet.WorriedDisease;
import com.moong.dto.request.pet.PetCreateRequest;
import com.moong.dto.request.pet.PetUpdateRequest;
import com.moong.dto.response.pet.PetCreateResponse;
import com.moong.dto.response.pet.PetReadResponse;
import com.moong.dto.response.pet.PetUpdateResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.crew.CrewRepository;
import com.moong.repository.pet.PetRepository;
import com.moong.repository.pet.WorriedDiseaseRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final WorriedDiseaseRepository worriedDiseaseRepository;
    private final CrewRepository crewRepository;

    @Transactional
    public PetCreateResponse createPet(Member member, PetCreateRequest petCreateRequest) {
        validateAlreadyHasPet(member);
        Pet pet = petCreateRequest.toPet();
        Pet savedPet = petRepository.save(pet);

        List<WorriedDisease> worriedDiseases = petCreateRequest.diseases()
                .stream()
                .map(disease -> new WorriedDisease(disease, pet))
                .toList();
        worriedDiseaseRepository.saveAll(worriedDiseases);
        return new PetCreateResponse(savedPet, worriedDiseases);
    }

    @Transactional(readOnly = true)
    public PetReadResponse findPetInfo(Member member) {
        Pet pet = findPet(member.getId());
        List<WorriedDisease> worriedDisease = worriedDiseaseRepository.findAllByPet_Id(pet.getId());
        return new PetReadResponse(pet, worriedDisease);
    }

    private void validateAlreadyHasPet(Member member) {
        crewRepository.findByMemberId(member.getId())
                .ifPresent(crew -> { throw new BusinessException(ErrorCode.ALREADY_EXISTS_PET);});
    }

    @Transactional
    public PetUpdateResponse updatePetInfo(Member member, PetUpdateRequest request) {
        Pet pet = findPet(member.getId());
        worriedDiseaseRepository.deleteAllByPetId(pet.getId());
        pet.updateInfo(
                request.petName(),
                request.breed(),
                request.gender(),
                request.birthDate().atDay(1),
                request.city(),
                request.district()
        );
        List<WorriedDisease> worriedDiseases = request.diseases()
                .stream()
                .map(disease -> new WorriedDisease(disease, pet))
                .toList();
        worriedDiseaseRepository.saveAll(worriedDiseases);

        return new PetUpdateResponse(pet, worriedDiseases);
    }

    private Pet findPet(long memberId) {
        Crew crew = crewRepository.getFetchedByMemberId(memberId);
        return crew.getPetGroup().getPet();
    }
 }
