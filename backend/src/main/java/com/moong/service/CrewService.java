package com.moong.service;

import com.moong.domain.entity.Crew;
import com.moong.repository.CrewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CrewService {

    private final CrewRepository crewRepository;

    public Crew getByMemberId(long memberId) {
        return crewRepository.getByMemberId(memberId);
    }
}
