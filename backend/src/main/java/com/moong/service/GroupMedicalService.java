package com.moong.service;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.GroupMedicalAdvice;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetMedical;
import com.moong.domain.entity.Treatment;
import com.moong.domain.enums.Disease;
import com.moong.domain.groupmedical.DiseaseStatistics;
import com.moong.domain.pet.PetAge;
import com.moong.domain.pet.PetMedicals;
import com.moong.dto.response.groupmedical.GroupMedicalInfoResponse;
import com.moong.dto.response.groupmedical.GroupMedicalStatisticsResponse;
import com.moong.dto.response.groupmedical.PetDiseaseRankingResponse;
import com.moong.dto.response.groupmedical.TreatmentsResponse;
import com.moong.repository.CrewRepository;
import com.moong.repository.GroupMedicalAdviceRepository;
import com.moong.repository.PetMedicalRepository;
import com.moong.repository.TreatmentRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GroupMedicalService {

    private static final int MAX_PET_MEDICAL_AGE = 20;
    private static final int MEDICAL_EXPECTED_RANGE = 7;

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
    public GroupMedicalStatisticsResponse findGroupMedicalStatistics(Member member) {
        Pet pet = findMemberPet(member);
        int endYear = Math.min(pet.getAge().plus(6), MAX_PET_MEDICAL_AGE);
        List<PetMedical> foundPetMedicals = petMedicalRepository.findByBreedAndGenderAndAgeBetween(
                pet.getBreed(),
                pet.getGender(),
                endYear - MEDICAL_EXPECTED_RANGE + 1,
                endYear
        );
        DiseaseStatistics diseaseStatistics = new DiseaseStatistics(foundPetMedicals, pet.getAge());
        return new GroupMedicalStatisticsResponse(diseaseStatistics);
    }

    @Transactional(readOnly = true)
    public TreatmentsResponse getTreatment(Member member, Disease disease) {
        Pet pet = findMemberPet(member);
        List<Treatment> treatments = treatmentRepository
                .findByDiseaseAndCityAndDistrict(disease, pet.getCity(), pet.getDistrict());

        return TreatmentsResponse.from(treatments);
    }

    @Transactional(readOnly = true)
    public PetDiseaseRankingResponse findPetDiseaseRanking(Member member) {
        Pet pet = findMemberPet(member);
        PetAge petAge = pet.getAge();

        List<PetMedical> petMedicalList = petMedicalRepository.findByBreedAndAgeAndGender(
                pet.getBreed(),
                petAge.getValue(),
                pet.getGender()
        );
        PetMedicals petMedicals = new PetMedicals(petMedicalList);

        return new PetDiseaseRankingResponse(petMedicals.getDiseases());
    }

    private Pet findMemberPet(Member member) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        return crew.getPetGroup().getPet();
    }
}
