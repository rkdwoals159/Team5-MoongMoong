package com.moong.exception.analyzer;

import java.util.concurrent.CompletableFuture;

public interface ErrorAnalyzer {

    CompletableFuture<AnalyzeErrorResponse> analyze(AnalyzeErrorRequest request);
}
