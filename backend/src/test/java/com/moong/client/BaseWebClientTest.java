package com.moong.client;

import java.io.IOException;
import java.nio.file.Files;
import org.apache.http.HttpHeaders;
import org.mockito.Mockito;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.ExchangeFunction;
import reactor.core.publisher.Mono;

@ActiveProfiles("test")
public abstract class BaseWebClientTest {

    protected ExchangeFunction mockExchangeFunction;

    protected void mockClient(HttpStatus status, String responsePath) throws IOException {
        String responseBody = makeResponseByPath(responsePath);
        Mockito.when(mockExchangeFunction.exchange(Mockito.any()))
                .thenReturn(Mono.just(ClientResponse.create(status)
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .body(responseBody)
                        .build())
                );
    }

    protected String makeResponseByPath(String path) throws IOException {
        return new String(Files.readAllBytes(
                new ClassPathResource(path).getFile().toPath())
        );
    }
}
