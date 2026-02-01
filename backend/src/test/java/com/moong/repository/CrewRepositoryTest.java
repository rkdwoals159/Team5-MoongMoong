package com.moong.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.Pet;
import com.moong.domain.entity.PetGroup;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceUnitUtil;
import java.time.LocalDateTime;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class CrewRepositoryTest extends BaseRepositoryTest {

    @Autowired
    private CrewRepository crewRepository;

    @Autowired
    private EntityManager entityManager;

    @DisplayName("멤버 ID로 조회 시, 연관된 PetGroup과 Pet을 Fetch Join으로 함께 조회한다.")
    @Test
    void getFetchedByMemberId() {
        LocalDateTime now = LocalDateTime.now();
        Member member = memberGenerator.generateSaved("member");
        Pet pet = petGenerator.generateSaved();
        PetGroup petGroup = petGroupGenerator.generateSaved(pet);
        crewGenerator.generateSaved(petGroup, member);

        PersistenceUnitUtil util =
                entityManager.getEntityManagerFactory().getPersistenceUnitUtil();

        entityManager.flush();
        entityManager.clear();

        Crew fetchedCrew = crewRepository.getFetchedByMemberId(member.getId());

        assertAll(
                () -> assertThat(fetchedCrew).isNotNull(),
                () -> assertThat(util.isLoaded(fetchedCrew)).isTrue(),
                () -> assertThat(util.isLoaded(fetchedCrew.getPetGroup())).isTrue(),
                () -> assertThat(util.isLoaded(fetchedCrew.getPetGroup().getPet())).isTrue()
        );
    }

}
