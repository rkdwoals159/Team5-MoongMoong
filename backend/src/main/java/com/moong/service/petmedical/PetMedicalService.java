package com.moong.service.petmedical;

import com.moong.client.petmedical.AiPetMedicalClient;
import com.moong.domain.crew.Crew;
import com.moong.domain.groupmedical.GroupMedicalAdvice;
import com.moong.domain.member.Member;
import com.moong.domain.pet.Pet;
import com.moong.domain.petmedical.PetMedical;
import com.moong.domain.treatment.Treatment;
import com.moong.domain.enums.Disease;
import com.moong.domain.groupmedical.DiseaseStatistics;
import com.moong.domain.pet.PetAge;
import com.moong.domain.pet.PetMedicals;
import com.moong.dto.response.petmedical.PetMedicalInfoResponse;
import com.moong.dto.response.petmedical.PetMedicalStatisticsResponse;
import com.moong.dto.response.petmedical.PetDiseaseRankingResponse;
import com.moong.dto.response.treatment.TreatmentsResponse;
import com.moong.repository.crew.CrewRepository;
import com.moong.repository.treatment.TreatmentRepository;
import com.moong.repository.medicaladvice.GroupMedicalAdviceRepository;
import com.moong.repository.petmedical.PetMedicalRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PetMedicalService {

    private static final int MAX_PET_MEDICAL_AGE = 20;
    private static final int MEDICAL_EXPECTED_RANGE = 7;
    private static final int PET_MEDICAL_BATCH_SIZE = 50;

    private final PetMedicalRepository petMedicalRepository;
    private final AiPetMedicalClient aiPetMedicalClient;
    private final CrewRepository crewRepository;
    private final GroupMedicalAdviceRepository groupMedicalAdviceRepository;
    private final TreatmentRepository treatmentRepository;

    public void syncFromAiServerOptimized() {
        Optional<LocalDateTime> latestCreatedDate = petMedicalRepository.findLatestCreatedDate();
        if(latestCreatedDate.isPresent()
                && latestCreatedDate.get().toLocalDate().isEqual(LocalDate.now())) {
            return;
        }
        aiPetMedicalClient.getPetMedicalsStream()
                .buffer(PET_MEDICAL_BATCH_SIZE)
                .doOnNext(batch -> {
                    List<PetMedical> petMedicals = batch.stream()
                            .flatMap(b -> b.toPetMedical().stream())
                            .toList();
                    petMedicalRepository.saveAllByBulkQuery(petMedicals);
                })
                .blockLast();
    }

    public PetMedicalInfoResponse getGroupMedicalInfo(Member member) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        long groupId = crew.getPetGroup().getId();

        GroupMedicalAdvice groupMedicalAdvice = groupMedicalAdviceRepository.getByPetGroup_Id(groupId);

        return new PetMedicalInfoResponse(groupMedicalAdvice);
    }

    @Transactional(readOnly = true)
    public PetMedicalStatisticsResponse findGroupMedicalStatistics(Member member) {
        Pet pet = findMemberPet(member);
        int endYear = Math.min(pet.getAge().plus(6), MAX_PET_MEDICAL_AGE);
        List<PetMedical> foundPetMedicals = petMedicalRepository.findByBreedAndGenderAndAgeBetween(
                pet.getBreed(),
                pet.getGender(),
                endYear - MEDICAL_EXPECTED_RANGE + 1,
                endYear
        );
        DiseaseStatistics diseaseStatistics = new DiseaseStatistics(foundPetMedicals, pet.getAge());
        return new PetMedicalStatisticsResponse(diseaseStatistics);
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
                Math.min(petAge.getValue(), MAX_PET_MEDICAL_AGE),
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
