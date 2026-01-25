package com.moong.repository;


import com.moong.fixture.MemberExpenseGenerator;
import com.moong.fixture.MemberGenerator;
import com.moong.fixture.PetFixtureGenerator;
import com.moong.fixture.WorriedDiseaseGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

@DataJpaTest
@Import({
        WorriedDiseaseGenerator.class,
        PetFixtureGenerator.class,
        MemberGenerator.class,
        MemberExpenseGenerator.class
})
public abstract class BaseRepositoryTest {

    @Autowired
    protected PetFixtureGenerator petFixtureGenerator;

    @Autowired
    protected WorriedDiseaseGenerator worriedDiseaseGenerator;

    @Autowired
    protected MemberGenerator memberGenerator;

    @Autowired
    protected MemberExpenseGenerator memberExpenseGenerator;

}
