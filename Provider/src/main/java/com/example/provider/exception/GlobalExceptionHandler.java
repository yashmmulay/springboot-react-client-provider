package com.example.provider.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ErrorDetails> handleProductException(ProductNotFoundException ex) {
        ErrorDetails details = new ErrorDetails();
        details.setMessage(ex.getMessage());
        details.setStatusCode(404);
        details.setTimeStamp(LocalDateTime.now());

        return new ResponseEntity<>(details, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleException(Exception ex) {
        ErrorDetails details = new ErrorDetails();
        details.setMessage("Something went wrong");

        details.setTimeStamp(LocalDateTime.now());

        return new ResponseEntity<>(details, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


