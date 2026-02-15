package com.moong.exception.analyzer.messagesender;

public record SlackMessage(
        String text,
        String channel
) {

    private static final String CLIENT_ERROR_SLACK_CHANNEL = "5조-client-error-analyze";

    public SlackMessage(String text) {
        this(text, CLIENT_ERROR_SLACK_CHANNEL);
    }
}
