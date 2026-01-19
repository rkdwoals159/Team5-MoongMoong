package com.moong.exception.dto;

import java.util.List;

public record MethodSignatureInfo(
        String className,
        int lineNumber,
        List<ParameterInfo> parameters,
        String returnType
) {}

