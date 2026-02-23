package com.moong.facade.petgroup;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.request.pet.PetCreateRequest;
import com.moong.dto.response.pet.PetCreateResponse;
import com.moong.service.GroupMedicalAdviceService;
import com.moong.service.GroupService;
import com.moong.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PetGroupFacadeService {

    private final GroupService groupService;
    private final PetService petService;
    private final GroupMedicalAdviceService groupMedicalAdviceService;

    @Transactional
    public PetCreateResponse firstJoin(Member member, PetCreateRequest petCreateRequest){
        PetCreateResponse response = petService.createPet(member, petCreateRequest);
        PetGroup savedPetGroup = groupService.firstJoin(member, response.petId());
        groupMedicalAdviceService.createMedicalAdvice(member.getId(), savedPetGroup.getId(), LocalDate.now());
        return response;
    }
}
