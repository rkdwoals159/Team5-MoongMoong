package com.moong.util.generator;

import com.moong.domain.petgroup.InviteCode;
import com.moong.config.petgroup.InviteCodeProperties;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@EnableConfigurationProperties(InviteCodeProperties.class)
public class InviteCodeGenerator {

    private static final String INVITE_CODE_CONFIG = "AES/GCM/NoPadding";

    private final InviteCodeProperties properties;

    public InviteCode encrypt(long groupId) {
        try {
            SecretKey secretKey = properties.getSecretKey();
            byte[] iv = SecureRandom.getInstanceStrong().generateSeed(12);

            Cipher cipher = Cipher.getInstance(INVITE_CODE_CONFIG);
            GCMParameterSpec spec = new GCMParameterSpec(128, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec);

            byte[] plaintext = ByteBuffer.allocate(Long.BYTES)
                    .putLong(groupId).array();

            byte[] encrypted = cipher.doFinal(plaintext);

            ByteBuffer buffer = ByteBuffer.allocate(iv.length + encrypted.length);
            buffer.put(iv).put(encrypted);

            String inviteCode = Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(buffer.array());

            return new InviteCode(inviteCode);
        } catch (Exception exception) {
            throw new BusinessException(ErrorCode.INVITE_CODE_ENCRYPT_ERROR);
        }
    }

    public long decode(InviteCode inviteCode) {
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(inviteCode.getCode());
            ByteBuffer buffer = ByteBuffer.wrap(decoded);

            byte[] iv = new byte[12];
            buffer.get(iv);

            byte[] cipherText = new byte[buffer.remaining()];
            buffer.get(cipherText);

            Cipher cipher = Cipher.getInstance(INVITE_CODE_CONFIG);
            cipher.init(
                    Cipher.DECRYPT_MODE,
                    properties.getSecretKey(),
                    new GCMParameterSpec(128, iv)
            );

            byte[] plain = cipher.doFinal(cipherText);
            return ByteBuffer.wrap(plain).getLong();
        } catch (Exception exception) {
            throw new BusinessException(ErrorCode.INVITE_CODE_DECRYPT_ERROR);
        }
    }
}
