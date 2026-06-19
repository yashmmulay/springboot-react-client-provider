package com.example.client.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ProviderUnavailableException.class)
    public ResponseEntity<ErrorDetails> handleProviderException(ProviderUnavailableException ex) {
        ErrorDetails details = new ErrorDetails();
        details.setMessage(ex.getMessage());
        details.setStatusCode(503);
        details.setTimeStamp(LocalDateTime.now());

        return new ResponseEntity<>(details, HttpStatus.SERVICE_UNAVAILABLE);
    }

}
