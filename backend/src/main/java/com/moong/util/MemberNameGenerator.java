package com.moong.util;

import java.security.SecureRandom;
import java.util.List;
import java.util.Random;
import java.util.function.Predicate;
import org.springframework.stereotype.Component;

@Component
public class MemberNameGenerator {

    private static final int MAX_NAME_SUFFIX_NUMBER = 9999;
    private static final int MAX_GENERATION_ATTEMPTS = 5;
    private static final int MAX_MEMBER_NAME_LENGTH = 20;
    private static final Random RANDOM = new SecureRandom();

    private static final List<String> PET_OWNER_SUFFIXES = List.of(
            "집사", "보호자", "주인", "견주", "냥집사",
            "맘", "아빠", "엄마", "파파", "마마",
            "언니", "오빠", "형", "누나",
            "이모", "삼촌", "이모부", "삼촌"
    );

    private static final List<String> DECORATORS = List.of(
            "멋있는", "상냥한", "다정한", "든든한", "따뜻한",
            "자상한", "귀여운", "사랑스러운", "친절한", "똑똑한",
            "용감한", "활발한", "즐거운", "행복한", "재밌는",
            "예쁜", "잘생긴", "화사한", "밝은", "쾌활한",
            "성실한", "책임있는", "부지런한", "열정적인", "긍정적인"
    );

    /**
     * 꾸밈말(Decorator)이 포함된 고유한 견주 이름을 생성합니다.
     * 예: "멋있는집사1234", "상냥한견주5678"
     *
     * @param isDuplicate 이름 중복 여부를 확인하는 Predicate
     * @return 꾸밈말이 포함된 고유한 견주 이름
     */
    public String generateUniqueNameWithDecorator(Predicate<String> isDuplicate) {
        for (int attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
            String name = generateRandomNameWithDecorator();
            if (!isDuplicate.test(name)) {
                return name;
            }
        }
        return generateRandomNameWithTimeStamp();
    }

    private String generateRandomNameWithTimeStamp() {
        String nameWithTimeStamp = generateRandomNameWithDecorator() + getTimestampSuffix();
        if(nameWithTimeStamp.length() > MAX_NAME_SUFFIX_NUMBER) {
            return nameWithTimeStamp.substring(0, MAX_NAME_SUFFIX_NUMBER);
        }
        return nameWithTimeStamp;
    }

    private String generateRandomNameWithDecorator() {
        String decorator = DECORATORS.get(RANDOM.nextInt(DECORATORS.size()));
        String suffix = PET_OWNER_SUFFIXES.get(RANDOM.nextInt(PET_OWNER_SUFFIXES.size()));
        int number = RANDOM.nextInt(MAX_NAME_SUFFIX_NUMBER) + 1;
        return decorator + suffix + number;
    }

    private long getTimestampSuffix() {
        return System.currentTimeMillis() % 10000;
    }
}
