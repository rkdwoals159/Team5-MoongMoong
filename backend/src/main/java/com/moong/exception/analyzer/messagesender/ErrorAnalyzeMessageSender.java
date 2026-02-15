package com.moong.exception.analyzer.messagesender;

import com.moong.exception.dto.AnalyzeErrorResponse;

public interface ErrorAnalyzeMessageSender {

    void send(AnalyzeErrorResponse response);
}
