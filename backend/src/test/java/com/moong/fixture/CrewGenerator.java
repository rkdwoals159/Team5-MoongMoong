package com.moong.fixture;

import com.moong.domain.entity.Crew;
import com.moong.domain.entity.Member;
import com.moong.domain.entity.PetGroup;
import com.moong.repository.CrewRepository;
import java.util.ArrayList;
import java.util.List;
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

    public List<Crew> generateSaveCrews(PetGroup petGroup, List<Member> members) {
        List<Crew> crews = new ArrayList<>();
        for (Member member : members) {
            crews.add(crewRepository.save(new Crew(petGroup, member)));
        }
        return crews;
    }
}
