package com.moong.service;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.GroupMedicalAdvice;
import com.moong.domain.entity.Member;
import com.moong.dto.response.GroupMedicalInfoResponse;
import com.moong.repository.CrewRepository;
import com.moong.repository.GroupMedicalAdviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GroupMedicalService {

    private final CrewRepository crewRepository;
    private final GroupMedicalAdviceRepository groupMedicalAdviceRepository;

    public GroupMedicalInfoResponse getGroupMedicalInfo(Member member) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        long groupId = crew.getPetGroup().getId();

        GroupMedicalAdvice groupMedicalAdvice = groupMedicalAdviceRepository.getByPetGroup_Id(groupId);

        return new GroupMedicalInfoResponse(groupMedicalAdvice);
    }
}
