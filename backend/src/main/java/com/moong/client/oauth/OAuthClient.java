package com.moong.client.oauth;


import com.moong.domain.member.MemberInfo;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class OAuthClient {

    private final RestClient restClient;

    public OAuthClient(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }

    public MemberInfo requestMemberInfo(String accessToken) {
        return restClient.get()
                .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                .headers(headers -> headers.setBearerAuth(accessToken))
                .retrieve()
                .body(MemberInfo.class);
    }
}
