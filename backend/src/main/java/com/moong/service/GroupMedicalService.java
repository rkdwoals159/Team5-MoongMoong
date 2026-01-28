package com.moong.service;

import com.moong.domain.entity.*;
import com.moong.domain.enums.Disease;
import com.moong.dto.response.groupmedical.GroupMedicalInfoResponse;
import com.moong.dto.response.groupmedical.TreatmentsResponse;
import com.moong.repository.CrewRepository;
import com.moong.repository.GroupMedicalAdviceRepository;
import com.moong.repository.TreatmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupMedicalService {

    private final CrewRepository crewRepository;
    private final GroupMedicalAdviceRepository groupMedicalAdviceRepository;
    private final TreatmentRepository treatmentRepository;

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
}
