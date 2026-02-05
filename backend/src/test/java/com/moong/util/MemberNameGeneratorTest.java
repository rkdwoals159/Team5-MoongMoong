package com.moong.util;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

import java.util.function.Predicate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class MemberNameGeneratorTest {

    @DisplayName("중복되지 않는 회원 이름을 랜덤생성한다 : 시도 1")
    @Test
    void generateUniqueNameWithDecorator() {
        MemberNameGenerator memberNameGenerator = new MemberNameGenerator();
        Predicate<String> mockDuplicateTest = Mockito.mock(Predicate.class);
        Mockito.when(mockDuplicateTest.test(any()))
                .thenReturn(false);

        assertAll(
                () -> assertThatCode(() -> memberNameGenerator.generateUniqueNameWithDecorator(mockDuplicateTest))
                        .doesNotThrowAnyException(),
                () -> Mockito.verify(mockDuplicateTest, Mockito.times(1)).test(anyString())
        );
    }

    @DisplayName("회원 이름이 중복될 때 최대 5번까지 시도하고 타임스탬프를 포함해 중복되지 않는 회원 이름을 생성한다 : 시도 5 -> 타임스탬프 포함")
    @Test
    void generateUniqueNameWithDecoratorDuplicateCase() {
        MemberNameGenerator memberNameGenerator = new MemberNameGenerator();
        Predicate<String> mockDuplicateTest = Mockito.mock(Predicate.class);
        Mockito.when(mockDuplicateTest.test(any()))
                .thenReturn(true);

        assertAll(
                () -> assertThatCode(() -> memberNameGenerator.generateUniqueNameWithDecorator(mockDuplicateTest))
                        .doesNotThrowAnyException(),
                () -> Mockito.verify(mockDuplicateTest, Mockito.times(5)).test(anyString())
        );
    }
}
