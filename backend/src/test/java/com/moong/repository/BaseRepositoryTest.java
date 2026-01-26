package com.moong.repository;

import com.moong.fixture.CrewGenerator;
import com.moong.fixture.GroupExpenseGenerator;
import com.moong.fixture.MemberGenerator;
import com.moong.fixture.PetGenerator;
import com.moong.fixture.PetGroupGenerator;
import com.moong.fixture.MemberExpenseGenerator;
import com.moong.fixture.WorriedDiseaseGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

@DataJpaTest
@Import({
        WorriedDiseaseGenerator.class,
        PetGenerator.class,
        PetGroupGenerator.class,
        GroupExpenseGenerator.class,
        CrewGenerator.class,
        MemberGenerator.class,
        MemberExpenseGenerator.class
})
public abstract class BaseRepositoryTest {

    @Autowired
    protected PetGenerator petGenerator;

    @Autowired
    protected WorriedDiseaseGenerator worriedDiseaseGenerator;

    @Autowired
    protected PetGroupGenerator petGroupGenerator;

    @Autowired
    protected CrewGenerator crewGenerator;

    @Autowired
    protected GroupExpenseGenerator groupExpenseGenerator;

    @Autowired
    protected MemberGenerator memberGenerator;

    @Autowired
    protected MemberExpenseGenerator memberExpenseGenerator;
}
