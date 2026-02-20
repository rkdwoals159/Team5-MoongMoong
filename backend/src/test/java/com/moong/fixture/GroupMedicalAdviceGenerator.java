package com.moong.fixture;

import com.moong.domain.entity.GroupMedicalAdvice;
import com.moong.domain.entity.PetGroup;
import com.moong.repository.medicaladvice.GroupMedicalAdviceRepository;
import org.springframework.stereotype.Component;

@Component
public class GroupMedicalAdviceGenerator {

    private final GroupMedicalAdviceRepository groupMedicalAdviceRepository;

    public GroupMedicalAdviceGenerator(GroupMedicalAdviceRepository groupMedicalAdviceRepository) {
        this.groupMedicalAdviceRepository = groupMedicalAdviceRepository;
    }

    public GroupMedicalAdvice generateSaved(PetGroup petGroup) {
        GroupMedicalAdvice groupMedicalAdvice = new GroupMedicalAdvice(
                "내년에는 정기 건강검진 주기를 단축하고 혈액·영상 검사를 병행하는 것을 권장합니다.",
                150000L,
                2027,
                petGroup
        );
        return groupMedicalAdviceRepository.save(groupMedicalAdvice);
    }
}
