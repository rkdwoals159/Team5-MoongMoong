package com.moong.facade.petgroup;

import com.moong.domain.member.Member;
import com.moong.domain.petgroup.PetGroup;
import com.moong.dto.request.pet.PetCreateRequest;
import com.moong.dto.response.pet.PetCreateResponse;
import com.moong.service.medicaladvice.PetMedicalAdviceService;
import com.moong.service.pet.PetService;
import com.moong.service.petgroup.PetGroupService;
import com.moong.util.transaction.TransactionAfterCommit;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PetGroupFacadeService {

    private final PetGroupService petGroupService;
    private final PetService petService;
    private final PetMedicalAdviceService petMedicalAdviceService;
    private final TransactionAfterCommit transactionAfterCommit;

    @Transactional
    public PetCreateResponse firstJoin(Member member, PetCreateRequest petCreateRequest){
        PetCreateResponse response = petService.createPet(member, petCreateRequest);
        PetGroup savedPetGroup = petGroupService.firstJoin(member, response.petId());

        transactionAfterCommit.run(() ->
                petMedicalAdviceService.createMedicalAdvice(
                        member.getId(),
                        savedPetGroup.getId(),
                        LocalDate.now()
                )
        );

        return response;
    }
}
