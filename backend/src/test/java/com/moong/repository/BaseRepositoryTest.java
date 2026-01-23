package com.moong.repository;


import com.moong.fixture.PetFixtureGenerator;
import com.moong.fixture.WorriedDiseaseGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

@DataJpaTest
@Import({
        WorriedDiseaseGenerator.class,
        PetFixtureGenerator.class
})
public abstract class BaseRepositoryTest {

    @Autowired
    protected PetFixtureGenerator petFixtureGenerator;

    @Autowired
    protected WorriedDiseaseGenerator worriedDiseaseGenerator;

}
