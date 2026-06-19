package com.example.client.exception;

public class ProviderUnavailableException extends RuntimeException {
    public ProviderUnavailableException(String message) {
        super(message);
    }
}
