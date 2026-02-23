package com.moong.key.sse;

public record RedisSseKey(long groupId) {

    private static final String PREFIX = "sse_groupId:";

    public String value() {
        return PREFIX + groupId;
    }
}
