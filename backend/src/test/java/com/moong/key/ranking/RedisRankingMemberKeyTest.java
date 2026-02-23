package com.moong.key.ranking;

import com.moong.domain.ranking.key.RedisRankingMemberKey;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

class RedisRankingMemberKeyTest {

    @DisplayName("'memberId_memberName' 형식을 정상 파싱한다")
    @Test
    void parse_success() {
        // when
        Optional<RedisRankingMemberKey> result = RedisRankingMemberKey.parse("123_A");

        // then
        assertAll(
                () -> assertThat(result).isPresent(),
                () -> assertThat(result.get()).isEqualTo(new RedisRankingMemberKey(123L, "A")),
                () -> assertThat(result.get().value()).isEqualTo("123_A")
        );
    }

    @DisplayName("null/blank면 empty를 반환한다")
    @Test
    void parse_null_or_blank_returnsEmpty() {
        Optional<RedisRankingMemberKey> nullResult = RedisRankingMemberKey.parse(null);
        Optional<RedisRankingMemberKey> emptyResult = RedisRankingMemberKey.parse("");
        Optional<RedisRankingMemberKey> blankResult = RedisRankingMemberKey.parse("   ");

        assertAll(
                () -> assertThat(nullResult).isEmpty(),
                () -> assertThat(emptyResult).isEmpty(),
                () -> assertThat(blankResult).isEmpty()
        );
    }

    @DisplayName("'_'가 없거나 마지막이 '_'면 empty를 반환한다")
    @Test
    void parse_invalidDelimiter_returnsEmpty() {
        Optional<RedisRankingMemberKey> noDelimiter = RedisRankingMemberKey.parse("123A");
        Optional<RedisRankingMemberKey> noName = RedisRankingMemberKey.parse("123_");

        assertAll(
                () -> assertThat(noDelimiter).isEmpty(),
                () -> assertThat(noName).isEmpty()
        );
    }

    @DisplayName("memberName에 '_'가 포함되어도 첫 '_' 기준으로 파싱된다")
    @Test
    void parse_nameContainsUnderscore() {
        Optional<RedisRankingMemberKey> result = RedisRankingMemberKey.parse("123_A_B");

        assertAll(
                () -> assertThat(result).isPresent(),
                () -> assertThat(result.get()).isEqualTo(new RedisRankingMemberKey(123L, "A_B")),
                () -> assertThat(result.get().value()).isEqualTo("123_A_B")
        );
    }
}

