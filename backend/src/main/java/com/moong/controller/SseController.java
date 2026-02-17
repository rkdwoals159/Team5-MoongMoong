package com.moong.controller;

import com.moong.annotation.auth.AuthMember;
import com.moong.controller.swagger.SseControllerSwagger;
import com.moong.domain.entity.Member;
import com.moong.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
public class SseController implements SseControllerSwagger {

    private final SseService sseService;

    @GetMapping(path = "/api/group/sse", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> subscribe(@AuthMember Member member) {
        SseEmitter sseEmitter = sseService.connect(member);
        return ResponseEntity.ok(sseEmitter);
    }
}
