package com.moong.facade.sse;

import com.moong.domain.entity.Member;
import com.moong.service.AuthService;
import com.moong.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
@RequiredArgsConstructor
public class SseFacadeService {

    private final SseService sseService;
    private final AuthService authService;

    public SseEmitter connect(String connectionToken) {
        Member member = authService.authorizeByConnectionToken(
                connectionToken
        );
        return sseService.connect(member);
    }
}
