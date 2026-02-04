package com.moong.ai;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OpenAiModel {

    GPT_4_1_MODEL("gpt-4.1-nano");

    private final String model;
}
