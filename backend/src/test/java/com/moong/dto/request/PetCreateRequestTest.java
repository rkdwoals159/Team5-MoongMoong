package com.moong.dto.request;

import static org.assertj.core.api.Assertions.assertThat;

import com.moong.domain.enums.Breed;
import com.moong.domain.enums.Disease;
import com.moong.domain.enums.Gender;
import com.moong.dto.BaseVailidationTest;
import com.moong.dto.request.pet.PetCreateRequest;
import com.moong.fixture.NullAndEmptyAndBlankSource;
import com.navercorp.fixturemonkey.ArbitraryBuilder;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.time.YearMonth;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;

class PetCreateRequestTest extends BaseVailidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private ArbitraryBuilder<PetCreateRequest> giveDefaultBuilder() {
        return fixtureMonkey.giveMeBuilder(PetCreateRequest.class)
                .set("petName", "초코")
                .set("breed", Breed.DAS)
                .set("gender", Gender.M)
                .set("birthDate", YearMonth.of(2024, 2))
                .set("city", "서울시")
                .set("district", "종로구")
                .set("diseases", List.of(Disease.OCU));
    }

    @DisplayName("펫 이름은 빈 값일 수 없다")
    @ParameterizedTest
    @NullAndEmptyAndBlankSource
    void validatePetName(String invalidPetName) {
        PetCreateRequest invalidateRequest = giveDefaultBuilder()
                .set("petName", invalidPetName)
                .sample();

        ConstraintViolation<PetCreateRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("반려동물 생성 요청 - 펫 이름은 빈 값일 수 없습니다");
    }

    @DisplayName("거주지는 빈 값일 수 없다")
    @ParameterizedTest
    @NullAndEmptyAndBlankSource
    void validateCity(String invalidCity) {
        PetCreateRequest invalidateRequest = giveDefaultBuilder()
                .set("city", invalidCity)
                .sample();

        ConstraintViolation<PetCreateRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("반려동물 생성 요청 - 거주 시는 빈 값일 수 없습니다");
    }

    @DisplayName("거주 구역는 빈 값일 수 없다")
    @ParameterizedTest
    @NullAndEmptyAndBlankSource
    void validateDistrict(String invalidDistrict) {
        PetCreateRequest invalidateRequest = giveDefaultBuilder()
                .set("district", invalidDistrict)
                .sample();

        ConstraintViolation<PetCreateRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("반려동물 생성 요청 - 거주 구역은 빈 값일 수 없습니다");
    }

    @DisplayName("견종은 null일 수 없다")
    @Test
    void validateBreed() {
        PetCreateRequest invalidateRequest = giveDefaultBuilder()
                .set("breed", null)
                .sample();

        ConstraintViolation<PetCreateRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("반려동물 생성 요청 - 반려동물 종류는 null일 수 없습니다");
    }

    @DisplayName("성별은 null일 수 없다")
    @Test
    void validateGender() {
        PetCreateRequest invalidateRequest = giveDefaultBuilder()
                .set("gender", null)
                .sample();

        ConstraintViolation<PetCreateRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("반려동물 생성 요청 - 반려동물 성별은 null일 수 없습니다");
    }

    @DisplayName("생년월일 null일 수 없다")
    @Test
    void validateBirthDate() {
        PetCreateRequest invalidateRequest = giveDefaultBuilder()
                .set("birthDate", null)
                .sample();

        ConstraintViolation<PetCreateRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("반려동물 생성 요청 - 반려동물 생년 월일은 null일 수 없습니다");
    }

    @DisplayName("우려 질병은 null일 수 없다")
    @Test
    void validateWorriedDisease() {
        PetCreateRequest invalidateRequest = giveDefaultBuilder()
                .set("diseases", null)
                .sample();

        ConstraintViolation<PetCreateRequest> violation = validator.validate(invalidateRequest)
                .iterator()
                .next();

        assertThat(violation.getMessage()).isEqualTo("반려동물 생성 요청 - 우려 질병 목록은 null일 수 없습니다");
    }
}
