package com.moong.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import com.moong.repository.CrewRepository;
import com.moong.repository.PetGroupRepository;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class GroupServiceTest extends BaseServiceTest {

    @Autowired
    private GroupService groupService;

    @Autowired
    private PetGroupRepository petGroupRepository;

    @Autowired
    private CrewRepository crewRepository;

    @DisplayName("첫 회원가입시 개인이 혼자 존재하는 그룹을 만든다")
    @Test
    void firstJoin() {
        Pet savedPet = petGenerator.generateSaved();
        Member member = memberGenerator.generateSaved("coli");

        PetGroup petGroup = groupService.firstJoin(member, savedPet.getId());

        Optional<PetGroup> foundPetGroup = petGroupRepository.findById(petGroup.getId());
        Optional<Crew> foundCrew = crewRepository.findByMemberId(member.getId());
        assertAll(
                () -> assertThat(foundPetGroup).isPresent(),
                () -> assertThat(foundCrew).isPresent()
        );
    }
}
