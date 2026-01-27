package com.moong.service;

import com.moong.domain.InviteCode;
import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.dto.request.PetGroupParticipateRequest;
import com.moong.dto.response.petgroup.PetGroupParticipateResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.CrewRepository;
import com.moong.repository.PetGroupRepository;
import com.moong.repository.PetRepository;
import com.moong.util.InviteCodeGenerator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GroupService {

    private static final int PET_GROUP_MAX_COUNT = 6;

    private final CrewRepository crewRepository;
    private final PetGroupRepository petGroupRepository;
    private final PetRepository petRepository;
    private final InviteCodeGenerator inviteCodeGenerator;

    @Transactional
    public PetGroup firstJoin(Member member, long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NO_SUCH_PET_FOUND));
        PetGroup savedPetGroup = petGroupRepository.save(new PetGroup(pet));
        crewRepository.save(new Crew(savedPetGroup, member));
        return savedPetGroup;
    }

    @Transactional
    public PetGroupParticipateResponse participate(Member member, PetGroupParticipateRequest request) {
        Crew crew = crewRepository.getByMemberId(member.getId());
        validateMemberIsAlone(crew.getPetGroup().getId());

        InviteCode inviteCode = InviteCode.parseFromUrl(request.inviteUrl());
        long decodedGroupId = inviteCodeGenerator.decode(inviteCode);
        PetGroup targetGroup = petGroupRepository.getById(decodedGroupId);
        List<Crew> targetGroupCrews = crewRepository.findAllByPetGroup_Id(targetGroup.getId());
        validateGroupIsFull(targetGroupCrews);
        validateAlreadyAttended(targetGroupCrews, member.getId());

        petGroupRepository.deleteById(crew.getPetGroup().getId());
        crewRepository.deleteById(crew.getId());
        Crew savedCrew = crewRepository.save(new Crew(targetGroup, member));
        return new PetGroupParticipateResponse(savedCrew.getId());
    }

    private void validateMemberIsAlone(long memberGroupId) {
        long participateGroupCount = crewRepository.countByPetGroup_Id(memberGroupId);
        if (participateGroupCount != 1) {
            throw new BusinessException(ErrorCode.ALREADY_PARTICIPATE_ANOTHER_PET_GROUP);
        }
    }

    private void validateGroupIsFull(List<Crew> targetGroupCrews) {
        if (targetGroupCrews.size() >= PET_GROUP_MAX_COUNT) {
            throw new BusinessException(ErrorCode.PET_GROUP_IS_FULL);
        }
    }

    private void validateAlreadyAttended(List<Crew> targetGroupCrews, long memberId) {
        targetGroupCrews.stream()
                .filter(crew -> crew.isSame(memberId))
                .findAny()
                .ifPresent((crew) -> {
                    throw new BusinessException(ErrorCode.ALREADY_ATTENDED_PET_GROUP);
                });
    }
}
