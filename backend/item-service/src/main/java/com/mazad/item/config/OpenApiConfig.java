package com.mazad.item.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    public static final String API_KEY_SCHEME = "ApiKeyAuth";

    @Bean
    public OpenAPI publicApiOpenAPI() {
        return new OpenAPI()
                .servers(List.of(new Server().url("/")))
                .info(new Info()
                        .title("Public Items API")
                        .version("v1")
                        .description("""
                                API for reading and managing items.
                                All endpoints require an API key sent in the X-API-KEY request header.
                                """))
                .components(new Components().addSecuritySchemes(
                        API_KEY_SCHEME,
                        new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.HEADER)
                                .name("X-API-KEY")
                                .description("API key used to authenticate requests.")
                ))
                .addSecurityItem(new SecurityRequirement().addList(API_KEY_SCHEME));
    }

    @Bean
    public GroupedOpenApi publicItemsApi() {
        return GroupedOpenApi.builder()
                .group("public-items")
                .pathsToMatch("/api/items/**")
                .build();
    }

}