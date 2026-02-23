package com.moong.service.crew;

import com.moong.domain.crew.Crew;
import com.moong.domain.member.Member;
import com.moong.repository.crew.CrewRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CrewService {

    private final CrewRepository crewRepository;

    public Crew getByMemberId(long memberId) {
        return crewRepository.getByMemberId(memberId);
    }

    public Crew getFetchedByMemberId(long memberId) {
        return crewRepository.getFetchedByMemberId(memberId);
    }

    public boolean existsByMemberId(long memberId) {
        return crewRepository.existsByMember_Id(memberId);
    }

    public List<Member> findAllMemberByGroupId(long groupId) {
        return crewRepository.findAllByPetGroup_IdWithFetchedMember(groupId)
                .stream()
                .map(Crew::getMember)
                .toList();
    }
}
