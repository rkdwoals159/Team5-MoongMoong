package com.moong.util;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import com.moong.domain.InviteCode;
import com.moong.domain.InviteCodeProperties;
import org.apache.commons.lang3.RandomUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class InviteCodeGeneratorTest {

    private static final String TEST_INVITE_AES_KEY = "yQ0PZ3V1+g8v5H2z2s5gPZpYxQqzZzJZ9f0uHn0x0K8=";

    private InviteCodeGenerator inviteCodeGenerator;

    @BeforeEach
    void setUp() {
        inviteCodeGenerator = new InviteCodeGenerator(new InviteCodeProperties(TEST_INVITE_AES_KEY));
    }

    @DisplayName("암호화된 초대코드 값을 해독할 수 있다")
    @Test
    void encrypt() {
        long groupId = RandomUtils.nextLong();
        InviteCode inviteCode = inviteCodeGenerator.encrypt(groupId);

        long decode = inviteCodeGenerator.decode(inviteCode);

        assertThat(decode).isEqualTo(groupId);
    }
}
