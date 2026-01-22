package com.moong.domain.enums;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum Breed {

    GREAT_PYRENEES("그레이트피레니즈", "GRE"),
    DALMATIAN("달마시안", "DAL"),
    DACHSHUND("닥스훈트", "DAS"),
    DOBERMAN_PINSCHER("도베르만 핀셔", "DOB"),
    GOLDEN_RETRIEVER("골든리트리버", "GOL"),
    LABRADOR_RETRIEVER("래브라도 리트리버", "LAB"),
    ALASKAN_MALAMUTE("말라뮤트", "MAL"),
    BULLDOG("불독", "BUL"),
    BEAGLE("비글", "BEA"),
    BICHON_FRISE("비숑프리제", "BIC"),
    SHEEPDOG("쉽독", "SHE"),
    SCHNAUZER("슈나우저", "SCH"),
    MIX_LONG_HAIR("믹스 장모", "MIL"),
    MIX_SHORT_HAIR("믹스 단모", "MIS"),
    HUSKY("허스키", "HUS"),
    HOUND("하운드", "HOU"),
    GERMAN_SHEPHERD("저먼셰퍼드", "GER"),
    JINDO("진도", "JIN"),
    CHIHUAHUA_SHORT("치와와 단모", "CHS"),
    CHIHUAHUA_LONG("치와와 장모", "CHL"),
    COCKER_SPANIEL("코커스패니얼", "COC"),
    TERRIER("테리어", "TER"),
    POMERANIAN("포메라니안", "POM"),
    POODLE("푸들", "POO"),
    SHIH_TZU("시추", "SHI"),
    WELSH_CORGI("웰시코기", "WEL"),
    ETC("기타", "ETC");

    private final String koreanName;
    private final String code;

    Breed(String koreanName, String code) {
        this.koreanName = koreanName;
        this.code = code;
    }

    public static Breed fromCode(String code) {
        return Arrays.stream(values())
                .filter(b -> b.code.equalsIgnoreCase(code))
                .findAny()
                .orElseThrow(() -> new IllegalArgumentException("Unknown breed code: " + code));
    }

    public static Breed fromKoreanName(String name) {
        return Arrays.stream(values())
                .filter(b -> b.koreanName.equals(name))
                .findAny()
                .orElseThrow(() -> new IllegalArgumentException("Unknown breed koreanName: " + name));
    }
}

