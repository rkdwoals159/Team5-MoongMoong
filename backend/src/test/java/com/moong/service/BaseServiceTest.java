package com.moong.service;

import com.moong.DataBaseCleaner;
import com.moong.fixture.MemberExpenseGenerator;
import com.moong.fixture.MemberGenerator;
import com.moong.fixture.PetFixtureGenerator;
import com.moong.fixture.WorriedDiseaseGenerator;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@ExtendWith(DataBaseCleaner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public abstract class BaseServiceTest {

    @Autowired
    protected PetFixtureGenerator petFixtureGenerator;

    @Autowired
    protected WorriedDiseaseGenerator worriedDiseaseGenerator;

    @Autowired
    protected MemberGenerator memberGenerator;

    @Autowired
    protected MemberExpenseGenerator memberExpenseGenerator;
}
