package com.moong.domain.enums;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum Breed {

    GRE("그레이트피레니즈", "GRE"),
    DAL("달마시안", "DAL"),
    DAS("닥스훈트", "DAS"),
    DOB("도베르만 핀셔", "DOB"),
    GOL("골든리트리버", "GOL"),
    LAB("래브라도 리트리버", "LAB"),
    MAL("말라뮤트", "MAL"),
    BUL("불독", "BUL"),
    BEA("비글", "BEA"),
    BIC("비숑프리제", "BIC"),
    SHE("쉽독", "SHE"),
    SCH("슈나우저", "SCH"),
    MIL("믹스 장모", "MIL"),
    MIS("믹스 단모", "MIS"),
    HUS("허스키", "HUS"),
    HOU("하운드", "HOU"),
    GER("저먼셰퍼드", "GER"),
    JIN("진도", "JIN"),
    CHS("치와와 단모", "CHS"),
    CHL("치와와 장모", "CHL"),
    COC("코커스패니얼", "COC"),
    TER("테리어", "TER"),
    POM("포메라니안", "POM"),
    POO("푸들", "POO"),
    SHI("시추", "SHI"),
    WEL("웰시코기", "WEL"),
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

