package com.moong.config.petmedical;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "pet-medical")
public record AiPetMedicalProperties(
        String baseUrl
) {

}
