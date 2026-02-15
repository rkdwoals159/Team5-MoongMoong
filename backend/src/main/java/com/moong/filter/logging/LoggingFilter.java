package com.moong.filter.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

@Slf4j
@Component
public class LoggingFilter extends OncePerRequestFilter {

    public static final String HTTP_METHOD_KEY = "httpMethod";
    public static final String HTTP_PATH_KEY = "httpPath";
    private static final String MDC_REQUEST_ID_KEY = "requestId";
    private static final String SENSITIVE_HEADER_VALUE = "****";
    private static final String EMPTY_STRING = "";
    private static final Set<String> SENSITIVE_HEADERS = Set.of(HttpHeaders.AUTHORIZATION, HttpHeaders.COOKIE);

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        MDC.put(MDC_REQUEST_ID_KEY, UUID.randomUUID().toString());
        MDC.put(HTTP_METHOD_KEY, request.getMethod());
        MDC.put(HTTP_PATH_KEY, request.getRequestURI());

        ContentCachingRequestWrapper cachingRequest = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper cachingResponse = new ContentCachingResponseWrapper(response);

        try {
            filterChain.doFilter(cachingRequest, cachingResponse);
        } finally {
            log.info("""
                            [HTTP LOG]
                            ▶ Request {} {}
                              Headers : {}
                              Body    : {}
                            ▶ Response
                              Status  : {}
                              Headers : {}
                              Body    : {}
                            """,
                    cachingRequest.getMethod(),
                    cachingRequest.getRequestURI(),
                    formatHeaders(cachingRequest),
                    getRequestBody(cachingRequest),
                    cachingResponse.getStatus(),
                    formatHeaders(cachingResponse),
                    getResponseBody(cachingResponse)
            );
            cachingResponse.copyBodyToResponse();
            MDC.clear();
        }
    }

    private String getRequestBody(ContentCachingRequestWrapper request) {
        byte[] content = request.getContentAsByteArray();
        if (content.length == 0) {
            return EMPTY_STRING;
        }
        return new String(content, StandardCharsets.UTF_8);
    }

    private String getResponseBody(ContentCachingResponseWrapper response) {
        byte[] content = response.getContentAsByteArray();
        if (content.length == 0) {
            return EMPTY_STRING;
        }
        return new String(content, StandardCharsets.UTF_8);
    }

    private Map<String, String> formatHeaders(HttpServletRequest request) {
        Map<String, String> headers = new HashMap<>();
        Enumeration<String> names = request.getHeaderNames();

        while (names.hasMoreElements()) {
            String name = names.nextElement();
            if (SENSITIVE_HEADERS.contains(name)) {
                headers.put(name, SENSITIVE_HEADER_VALUE);
                continue;
            }
            headers.put(name, request.getHeader(name));
        }
        return headers;
    }

    private Map<String, String> formatHeaders(HttpServletResponse response) {
        Map<String, String> headers = new HashMap<>();
        for (String name : response.getHeaderNames()) {
            headers.put(name, response.getHeader(name));
        }
        return headers;
    }
}
