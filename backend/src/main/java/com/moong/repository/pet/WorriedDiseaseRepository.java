package com.moong.repository.pet;

import com.moong.domain.pet.WorriedDisease;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface WorriedDiseaseRepository extends Repository<WorriedDisease, Long> {

    WorriedDisease save(WorriedDisease worriedDisease);

    default void saveAll(List<WorriedDisease> worriedDiseases) {
        for (WorriedDisease worriedDisease : worriedDiseases) {
            save(worriedDisease);
        }
    }

    List<WorriedDisease> findAll();

    List<WorriedDisease> findAllByPet_Id(long petId);

    @Transactional
    @Modifying(flushAutomatically = true)
    @Query("delete from WorriedDisease wd where wd.pet.id = :petId")
    void deleteAllByPetId(@Param("petId") long petId);
}
