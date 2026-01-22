package com.moong.exception;

import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException exception) {
        log.warn("Method argument type mismatch", exception);
        return toResponse(ErrorCode.METHOD_ARGUMENT_TYPE_MISMATCH);
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ErrorResponse> handleBindingException(BindException exception) {
        log.warn("Binding exception occurred", exception);
        return toResponse(ErrorCode.FIELD_ERROR);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(ConstraintViolationException exception) {
        log.warn("Constraint violation occurred", exception);
        return toResponse(ErrorCode.URL_PARAMETER_ERROR);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingServletRequestParameterException(
            MissingServletRequestParameterException exception) {
        log.warn("Missing required query parameter", exception);
        return toResponse(ErrorCode.URL_PARAMETER_ERROR);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleHttpRequestMethodNotSupportedException(
            HttpRequestMethodNotSupportedException exception) {
        log.warn("HTTP method not supported", exception);
        return toResponse(ErrorCode.METHOD_NOT_SUPPORTED);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleHttpMediaTypeNotSupportedException(
            HttpMediaTypeNotSupportedException exception) {
        log.warn("Unsupported media type", exception);
        return toResponse(ErrorCode.MEDIA_TYPE_NOT_SUPPORTED);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoResourceFoundException(NoResourceFoundException exception) {
        log.warn("No resource found", exception);
        return toResponse(ErrorCode.NO_RESOURCE_FOUND);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException exception) {
        log.warn("Business exception occurred: {}", exception.getMessage(), exception);
        return toResponse(exception.getErrorCode());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception exception) {
        log.error("Unhandled exception occurred", exception);
        return toResponse(ErrorCode.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<ErrorResponse> toResponse(ErrorCode errorCode) {
        ErrorResponse errorResponse = new ErrorResponse(errorCode);
        return ResponseEntity.status(errorCode.getStatusCode())
                .body(errorResponse);
    }
}
