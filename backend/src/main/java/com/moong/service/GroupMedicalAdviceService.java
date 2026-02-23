package com.moong.service;

import com.moong.ai.OpenAiModel;
import com.moong.ai.OpenAiResult;
import com.moong.ai.TokenUsage;
import com.moong.client.medicaladvice.MedicalAdviceClient;
import com.moong.domain.entity.GroupExpense;
import com.moong.domain.entity.GroupMedicalAdvice;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.domain.entity.PetMedical;
import com.moong.domain.entity.Treatment;
import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.medicaladvice.AiMedicalAdvice;
import com.moong.dto.response.medicaladvice.AiMedicalAdviceRequest;
import com.moong.dto.response.medicaladvice.AiMedicalAdviceResponse;
import com.moong.event.dto.AiAdviceCreatedPayload;
import com.moong.event.dto.GroupEventMessage;
import com.moong.event.transport.GroupEventChannelSender;
import com.moong.repository.PetGroupRepository;
import com.moong.repository.TreatmentRepository;
import com.moong.repository.groupexpense.GroupExpenseRepository;
import com.moong.repository.medicaladvice.GroupMedicalAdviceJdbcRepository;
import com.moong.repository.petmedical.PetMedicalRepository;
import com.moong.repository.medicaladvice.GroupMedicalAdviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class GroupMedicalAdviceService {

    private static final int MAX_PET_MEDICAL_AGE = 20;
    private static final int MEDICAL_ADVICE_SAVE_BATCH_SIZE = 100;

    private final MedicalAdviceClient medicalAdviceClient;
    private final PetGroupRepository petGroupRepository;
    private final GroupExpenseRepository groupExpenseRepository;
    private final TreatmentRepository treatmentRepository;
    private final PetMedicalRepository petMedicalRepository;
    private final GroupMedicalAdviceRepository groupMedicalAdviceRepository;
    private final GroupMedicalAdviceJdbcRepository groupMedicalAdviceJdbcRepository;

    private final GroupEventChannelSender groupEventChannelSender;

    public void upsertAllMedicalAdvice(LocalDate date) {
        long petGroupCount = petGroupRepository.count();
        Year nextYear = Year.from(date).plusYears(1);

        for(long i = 1; i <= petGroupCount; i += MEDICAL_ADVICE_SAVE_BATCH_SIZE){
            long nextBatchCursor = Math.min(i + MEDICAL_ADVICE_SAVE_BATCH_SIZE - 1, petGroupCount);
            List<AiMedicalAdvice> aiMedicalAdvices = new ArrayList<>();

            for (long j = i; j <= nextBatchCursor; j++) {
                AiMedicalAdviceRequest input = getAiMedicalAdviceInput(j, date);
                AiMedicalAdviceResponse response = getAiMedicalAdvice(input);
                aiMedicalAdvices.add(new AiMedicalAdvice(response, j, nextYear));
            }
            groupMedicalAdviceJdbcRepository.upsertAllByBulkQuery(aiMedicalAdvices);
        }
    }

    @Async("groupEventChannelExecutor")
    public void createMedicalAdvice(long memberId, long groupId, LocalDate date) {
        Year nextYear = Year.from(date).plusYears(1);
        AiMedicalAdviceRequest input = getAiMedicalAdviceInput(groupId, date);
        AiMedicalAdviceResponse response = getAiMedicalAdvice(input);
        PetGroup petGroup = petGroupRepository.getById(groupId);
        GroupMedicalAdvice groupMedicalAdvice = new GroupMedicalAdvice(
                response.medicalAdvice(),
                response.expectedCost(),
                nextYear.getValue(),
                petGroup
        );
        groupMedicalAdviceRepository.save(groupMedicalAdvice);

        GroupEventMessage<AiAdviceCreatedPayload> adviceCreatedMessage =
                GroupEventMessage.adviceCreated(memberId, groupId);

        groupEventChannelSender.sendAsync(adviceCreatedMessage);
    }

    public AiMedicalAdviceRequest getAiMedicalAdviceInput(long groupId, LocalDate date) {
        Pet pet = petGroupRepository.getFetchedPetById(groupId).getPet();
        int nextAge = Math.min(pet.getAge().plus(1), MAX_PET_MEDICAL_AGE);
        PetMedical highestRiskMedical = petMedicalRepository.findTopRatioPetMedical(
                pet.getBreed(),
                nextAge,
                pet.getGender()
        );

        List<Treatment> treatments = treatmentRepository.findByDiseaseAndCityAndDistrict(
                highestRiskMedical.getDisease(),
                pet.getCity(),
                pet.getDistrict()
        );
        List<GroupExpense> groupMedicalExpenses = groupExpenseRepository.findFetchedByPetGroupIdAndMainCategoryAndPeriod(
                groupId,
                MainCategoryType.MEDICAL_EXPENSES,
                date.withDayOfYear(1),
                date,
                Sort.unsorted()
        );

        return new AiMedicalAdviceRequest(highestRiskMedical, treatments, groupMedicalExpenses);
    }

    public AiMedicalAdviceResponse getAiMedicalAdvice(AiMedicalAdviceRequest input) {
        OpenAiResult<AiMedicalAdviceResponse> fallBackResponse = new OpenAiResult<>(
                AiMedicalAdviceResponse.nonResponse(),
                TokenUsage.zeroUsage()
        );

        OpenAiResult<AiMedicalAdviceResponse> result = medicalAdviceClient.getMedicalAdvice(
                        input,
                        OpenAiModel.GPT_4_1_MINI_MODEL
                )
                .completeOnTimeout(
                        fallBackResponse,
                        10L,
                        TimeUnit.SECONDS
                ).exceptionally(exception -> fallBackResponse)
                .join();

        return result.getResult();
    }
}
