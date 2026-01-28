package com.moong.service;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.GroupMedicalAdvice;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetMedical;
import com.moong.domain.pet.PetAge;
import com.moong.domain.pet.PetMedicals;
import com.moong.dto.response.groupmedical.PetDiseaseRankingResponse;
import com.moong.domain.entity.*;
import com.moong.domain.enums.Disease;
import com.moong.dto.response.groupmedical.GroupMedicalInfoResponse;
import com.moong.dto.response.groupmedical.TreatmentsResponse;
import com.moong.repository.CrewRepository;
import com.moong.repository.GroupMedicalAdviceRepository;
import com.moong.repository.PetMedicalRepository;
import java.util.List;
import com.moong.repository.TreatmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GroupMedicalService {

    private final CrewRepository crewRepository;
    private final GroupMedicalAdviceRepository groupMedicalAdviceRepository;
    private final TreatmentRepository treatmentRepository;
    private final PetMedicalRepository petMedicalRepository;

    public GroupMedicalInfoResponse getGroupMedicalInfo(Member member) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        long groupId = crew.getPetGroup().getId();

        GroupMedicalAdvice groupMedicalAdvice = groupMedicalAdviceRepository.getByPetGroup_Id(groupId);

        return new GroupMedicalInfoResponse(groupMedicalAdvice);
    }

    @Transactional(readOnly = true)
    public TreatmentsResponse getTreatment(Member member, Disease disease) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        PetGroup petGroup = crew.getPetGroup();
        Pet pet = petGroup.getPet();

        List<Treatment> treatments = treatmentRepository
                .findByDiseaseAndCityAndDistrict(disease, pet.getCity(), pet.getDistrict());

        return TreatmentsResponse.from(treatments);
    }

    @Transactional(readOnly = true)
    public PetDiseaseRankingResponse findPetDiseaseRanking(Member member) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        Pet pet = crew.getPetGroup().getPet();
        PetAge petAge = new PetAge(pet.getBirthDate());

        List<PetMedical> petMedicalList = petMedicalRepository.findByBreedAndAgeAndGender(
                pet.getBreed(),
                petAge.getAge(),
                pet.getGender()
        );
        PetMedicals petMedicals = new PetMedicals(petMedicalList);

        return new PetDiseaseRankingResponse(petMedicals.getDiseases());
    }
}
