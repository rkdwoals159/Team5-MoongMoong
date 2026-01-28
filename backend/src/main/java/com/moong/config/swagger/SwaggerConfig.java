package com.moong.config.swagger;


import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList(HttpHeaders.AUTHORIZATION);

        SecurityScheme securityScheme = new SecurityScheme()
                .name(HttpHeaders.AUTHORIZATION)
                .type(SecurityScheme.Type.APIKEY)
                .in(SecurityScheme.In.HEADER);

        return new OpenAPI()
                .addServersItem(new Server().url("/"))
                .info(getInfo())
                .components(new Components().addSecuritySchemes(HttpHeaders.AUTHORIZATION, securityScheme))
                .addSecurityItem(securityRequirement);
    }

    private Info getInfo() {
        return new Info().title("Moong-Moong API 문서")
                .version("1.0.0");
    }
}

