package com.moong.fixture;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.PetGroup;
import com.moong.repository.CrewRepository;
import org.springframework.stereotype.Component;

@Component
public class CrewGenerator {

    private final CrewRepository crewRepository;

    public CrewGenerator(CrewRepository crewRepository) {
        this.crewRepository = crewRepository;
    }

    public Crew generateSaved(PetGroup petGroup, Member member) {
        return crewRepository.save(new Crew(petGroup, member));
    }
}
