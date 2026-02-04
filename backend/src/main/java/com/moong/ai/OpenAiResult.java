package com.moong.ai;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.moong.ai.mapper.OpenAiResultDeserializer;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
@JsonDeserialize(using = OpenAiResultDeserializer.class)
public class OpenAiResult <T> {

    private final T result;
    private final TokenUsage tokenUsage;
}
