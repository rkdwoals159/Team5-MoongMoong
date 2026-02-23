package com.moong.exception.analyzer;

import java.util.List;

public record MethodSignatureInfo(
        String className,
        int lineNumber,
        List<ParameterInfo> parameters,
        String returnType
) {}

