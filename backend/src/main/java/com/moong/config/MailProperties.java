package com.moong.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "moong.mail")
public record MailProperties(
        String from,
        String serviceName
) {}
