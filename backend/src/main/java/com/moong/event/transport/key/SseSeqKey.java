package com.moong.event.transport.key;

public record SseSeqKey(
        long groupId
) {

    private static final String PREFIX = "sse:seq:groupId:";

    public String value() {
        return PREFIX + groupId;
    }
}
