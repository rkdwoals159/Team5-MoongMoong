package com.moong.exception.analyzer;

import com.moong.exception.dto.AnalyzeErrorRequest;
import com.moong.exception.dto.AnalyzeErrorResponse;
import com.moong.exception.dto.AnalyzeErrorResult;
import java.util.concurrent.CompletableFuture;

public class ConsoleErrorAnalyzer implements ErrorAnalyzer {

    @Override
    public CompletableFuture<AnalyzeErrorResponse> analyze(AnalyzeErrorRequest request) {
        AnalyzeErrorResponse response = new AnalyzeErrorResponse(
                new AnalyzeErrorResult(
                       request.httpMethod() +  request.path() +"에서 에러 발생!",
                        "에러 발생 이유",
                        "가이드",
                        "추론 이유"
                ),
                true, null, null, null, null, null
        );
        return CompletableFuture.completedFuture(response);
    }
}
