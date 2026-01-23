package com.moong.service;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.CrewRepository;
import com.moong.repository.PetGroupRepository;
import com.moong.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final CrewRepository crewRepository;
    private final PetGroupRepository petGroupRepository;
    private final PetRepository petRepository;

    @Transactional
    public PetGroup firstJoin(Member member, long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NO_SUCH_PET_FOUND));
        PetGroup savedPetGroup = petGroupRepository.save(new PetGroup(pet));
        crewRepository.save(new Crew(savedPetGroup, member));
        return savedPetGroup;
    }
}
