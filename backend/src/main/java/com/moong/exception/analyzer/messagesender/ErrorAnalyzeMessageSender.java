package com.moong.exception.analyzer.messagesender;

import com.moong.exception.analyzer.AnalyzeErrorResponse;

public interface ErrorAnalyzeMessageSender {

    void send(AnalyzeErrorResponse response);
}
