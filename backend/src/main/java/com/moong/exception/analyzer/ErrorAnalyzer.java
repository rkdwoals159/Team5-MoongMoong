package com.moong.exception.analyzer;

import com.moong.exception.dto.AnalyzeErrorRequest;
import com.moong.exception.dto.AnalyzeErrorResponse;
import java.util.concurrent.CompletableFuture;

public interface ErrorAnalyzer {

    CompletableFuture<AnalyzeErrorResponse> analyze(AnalyzeErrorRequest request);
}
