package com.moong.repository;

import com.moong.domain.entity.WorriedDisease;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface WorriedDiseaseRepository extends Repository<WorriedDisease, Long> {

    WorriedDisease save(WorriedDisease worriedDisease);

    default void saveAll(List<WorriedDisease> worriedDiseases) {
        for (WorriedDisease worriedDisease : worriedDiseases) {
            save(worriedDisease);
        }
    }

    List<WorriedDisease> findAll();
}
