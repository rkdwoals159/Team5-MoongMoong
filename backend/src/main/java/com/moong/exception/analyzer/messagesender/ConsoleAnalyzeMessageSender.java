package com.moong.exception.analyzer.messagesender;

import com.moong.exception.analyzer.AnalyzeErrorResponse;
import com.moong.exception.analyzer.AnalyzeErrorResult;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ConsoleAnalyzeMessageSender implements ErrorAnalyzeMessageSender {

    @Override
    public void send(AnalyzeErrorResponse response) {
        AnalyzeErrorResult result = response.json();
        log.info("action : {}", result.action());
        log.info("reason : {}", result.reason());
        log.info("guild : {}", result.guide());
        log.info("inference : {}", result.inference());
    }
}
