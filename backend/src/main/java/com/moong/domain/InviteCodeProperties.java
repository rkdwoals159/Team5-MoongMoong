package com.moong.domain;

import java.util.Base64;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@RequiredArgsConstructor
@ConfigurationProperties(prefix = "invite")
public class InviteCodeProperties {

    private final String ENCRYPTION_ALGORITHM = "AES";
    private final String key;

    public SecretKey getSecretKey() {
        byte[] encryptKey = Base64.getDecoder()
                .decode(key);
        return new SecretKeySpec(encryptKey, ENCRYPTION_ALGORITHM);
    }
}
