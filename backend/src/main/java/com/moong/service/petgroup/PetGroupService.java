package com.moong.service.petgroup;

import com.moong.domain.petgroup.InviteCode;
import com.moong.domain.crew.Crew;
import com.moong.domain.member.Member;
import com.moong.domain.notification.NotificationCursor;
import com.moong.domain.pet.Pet;
import com.moong.domain.petgroup.PetGroup;
import com.moong.dto.request.petgroup.PetGroupParticipateRequest;
import com.moong.dto.response.petgroup.GroupCrewResponse;
import com.moong.dto.response.petgroup.PetGroupParticipateResponse;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.repository.crew.CrewRepository;
import com.moong.repository.petgroup.PetGroupRepository;
import com.moong.repository.pet.PetRepository;
import com.moong.repository.medicaladvice.GroupMedicalAdviceRepository;
import com.moong.repository.notification.NotificationCursorRepository;
import com.moong.util.generator.InviteCodeGenerator;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PetGroupService {

    private static final int PET_GROUP_MAX_COUNT = 6;

    private final CrewRepository crewRepository;
    private final PetGroupRepository petGroupRepository;
    private final GroupMedicalAdviceRepository groupMedicalAdviceRepository;
    private final PetRepository petRepository;
    private final NotificationCursorRepository notificationCursorRepository;
    private final InviteCodeGenerator inviteCodeGenerator;

    @Transactional
    public PetGroup firstJoin(Member member, long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NO_SUCH_PET_FOUND));
        PetGroup savedPetGroup = petGroupRepository.save(new PetGroup(pet));
        Crew crew = crewRepository.save(new Crew(savedPetGroup, member));
        notificationCursorRepository.save(new NotificationCursor(crew));
        return savedPetGroup;
    }

    @Transactional
    public PetGroupParticipateResponse participate(Member member, PetGroupParticipateRequest request) {
        InviteCode inviteCode = InviteCode.parseFromUrl(request.inviteUrl());
        long decodedGroupId = inviteCodeGenerator.decode(inviteCode);
        PetGroup targetGroup = petGroupRepository.getById(decodedGroupId);
        List<Crew> targetGroupCrews = crewRepository.findAllByPetGroup_Id(targetGroup.getId());
        validateGroupIsFull(targetGroupCrews);
        validateAlreadyAttended(targetGroupCrews, member.getId());

        Optional<Crew> foundCrew = crewRepository.findByMemberId(member.getId());
        foundCrew.ifPresent(crew -> {
            validateMemberIsAlone(crew.getPetGroup().getId());
            changeGroupInfo(crew);
        });
        Crew savedCrew = crewRepository.save(new Crew(targetGroup, member));
        notificationCursorRepository.save(new NotificationCursor(savedCrew));
        return new PetGroupParticipateResponse(savedCrew.getId());
    }

    private void changeGroupInfo(Crew crew) {
        crewRepository.deleteById(crew.getId());
        petGroupRepository.deleteById(crew.getPetGroup().getId());
        groupMedicalAdviceRepository.deleteByPetGroup_Id(crew.getPetGroup().getId());
        notificationCursorRepository.deleteByCrew_Id(crew.getId());
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

    public PetGroup findFetchedPetGroupByInviteUrl(String inviteUrl) {
        InviteCode inviteCode = InviteCode.parseFromUrl(inviteUrl);
        long groupId = inviteCodeGenerator.decode(inviteCode);
        return petGroupRepository.getFetchedPetByPetId(groupId);
    }

    public GroupCrewResponse getCrews(Member member) {
        Crew crew = crewRepository.getFetchedByMemberId(member.getId());
        InviteCode inviteCode = inviteCodeGenerator.encrypt(crew.getPetGroup().getId());
        List<Crew> crews = crewRepository.findAllByPetGroup_IdWithFetchedMember(crew.getPetGroup().getId())
                .stream()
                .filter(crewOne -> !crewOne.isSame(member.getId()))
                .toList();
        return new GroupCrewResponse(member, inviteCode, crews);
    }

    public List<PetGroup> findAll() {
        return petGroupRepository.findAll();
    }
}
