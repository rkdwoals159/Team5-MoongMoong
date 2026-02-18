package com.moong.controller.swagger;

import com.moong.annotation.swagger.ErrorCode401;
import com.moong.annotation.swagger.ErrorCode500;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface SseControllerSwagger {

    @Operation(
            summary = "SSE 연결",
            description = """
                그룹 관련 이벤트를 받을 수 있도록 서버와 SSE 연결을 생성합니다.
                - Authorization 헤더에 Connection 토큰을 Bearer 형식으로 전달해야 합니다.
                - 응답은 text/event-stream 스트림이며, 연결이 유지됩니다.
                """
    )
    @ApiResponse(
            responseCode = "200",
            description = "연결 성공",
            content = @Content(mediaType = MediaType.TEXT_EVENT_STREAM_VALUE)
    )
    @ErrorCode401
    @ErrorCode500
    ResponseEntity<SseEmitter> subscribe(
            String rawConnectionToken
    );
}
