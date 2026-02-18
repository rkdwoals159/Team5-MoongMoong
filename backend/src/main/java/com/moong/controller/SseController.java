package com.moong.controller;

import com.moong.controller.swagger.SseControllerSwagger;
import com.moong.facade.sse.SseFacadeService;
import com.moong.util.AuthorizationHeaderExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
public class SseController implements SseControllerSwagger {

    private final SseFacadeService sseFacadeService;
    private final AuthorizationHeaderExtractor authorizationHeaderExtractor;

    @GetMapping(path = "/api/group/sse")
    public ResponseEntity<SseEmitter> subscribe(
            @RequestHeader(HttpHeaders.AUTHORIZATION)
            String rawConnectionToken
    ) {
        String connectionToken = authorizationHeaderExtractor.extractBearerToken(rawConnectionToken);
        SseEmitter sseEmitter = sseFacadeService.connect(connectionToken);

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_EVENT_STREAM)
                .body(sseEmitter);
    }
}
