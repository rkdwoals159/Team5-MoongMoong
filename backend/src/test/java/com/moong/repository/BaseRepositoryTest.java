package com.moong.repository;

import com.moong.fixture.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@Import({
        WorriedDiseaseGenerator.class,
        PetGenerator.class,
        PetGroupGenerator.class,
        GroupExpenseGenerator.class,
        MemberGenerator.class,
        CrewGenerator.class,
        MemberExpenseGenerator.class,
        GroupMedicalAdviceGenerator.class,
        PetMedicalGenerator.class
})
@ActiveProfiles("test")
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

    @Autowired
    protected GroupMedicalAdviceGenerator groupMedicalAdviceGenerator;

    @Autowired
    PetMedicalGenerator petMedicalGenerator;
}
