package com.moong.key.ranking;

import java.util.Optional;

public record RedisRankingMemberKey(
        long memberId,
        String memberName
) {
    public String value() {
        return memberId + "_" + memberName;
    }

    public static Optional<RedisRankingMemberKey> parse(String raw) {
        if (raw == null || raw.isBlank()) return Optional.empty();

        int idx = raw.indexOf('_');
        if (idx < 0 || idx == raw.length() - 1) return Optional.empty();

        long id = Long.parseLong(raw.substring(0, idx));
        String name = raw.substring(idx + 1);

        return Optional.of(new RedisRankingMemberKey(id, name));
    }
}
