package com.moong.domain.enums;

import java.util.Arrays;
import lombok.Getter;

@Getter
public enum Disease {

    DERMATOLOGY("피부과", "Dermatology", "DER",
            "피부염, 알러지, 탈모, 농피증, 곰팡이, 외부기생충 등"),

    MUSCULOSKELETAL("근골격계", "Musculoskeletal", "MUS",
            "관절염, 슬개골 탈구, 인대 파열, 디스크 등"),

    NEUROLOGY("신경과", "Neurology", "NEU",
            "간질, 발작, 마비, 척수질환 등"),

    OCULAR("안과", "Ocular", "OCU",
            "결막염, 각막염, 백내장, 녹내장 등"),

    RESPIRATORY("호흡기과", "Respiratory", "RES",
            "기관지염, 폐렴, 비염, 기침 등"),

    CARDIOLOGY("심장과", "Cardiology", "CAR",
            "심장병, 심부전, 심잡음 등"),

    HEMATOLOGY("혈액과", "Hematology", "HEM",
            "빈혈, 혈소판 감소, 응고 이상 등"),

    GASTROINTESTINAL("소화기과", "Gastrointestinal", "GAS",
            "구토, 설사, 장염, 위염, 췌장염 등"),

    URINARY("비뇨기과", "Urinary", "URI",
            "방광염, 요로결석, 신장질환 등"),

    REPRODUCTIVE("생식기과", "Reproductive", "REP",
            "자궁축농증, 전립선 질환, 임신 관련 문제 등"),

    ENDOCRINE("내분비과", "Endocrine", "END",
            "당뇨, 쿠싱, 애디슨, 갑상선 질환 등"),

    INFECTIOUS("감염과", "Infectious", "INF",
            "세균·바이러스·기생충 감염, 전염병 등");

    private final String koreanName;
    private final String englishName;
    private final String code;
    private final String example;

    Disease(String koreanName, String englishName, String code, String example) {
        this.koreanName = koreanName;
        this.englishName = englishName;
        this.code = code;
        this.example = example;
    }

    // --- 편의 메서드들 ---

    public static Disease fromCode(String code) {
        return Arrays.stream(values())
                .filter(d -> d.code.equalsIgnoreCase(code))
                .findAny()
                .orElseThrow(() -> new IllegalArgumentException("Unknown disease code: " + code));
    }

    public static Disease fromKoreanName(String name) {
        return Arrays.stream(values())
                .filter(d -> d.koreanName.equals(name))
                .findAny()
                .orElseThrow(() -> new IllegalArgumentException("Unknown disease koreanName: " + name));
    }

    public static Disease fromEnglishName(String name) {
        return Arrays.stream(values())
                .filter(d -> d.englishName.equalsIgnoreCase(name))
                .findAny()
                .orElseThrow(() -> new IllegalArgumentException("Unknown disease englishName: " + name));
    }
}
