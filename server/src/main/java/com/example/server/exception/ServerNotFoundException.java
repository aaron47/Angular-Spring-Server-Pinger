package com.example.server.exception;

import org.springframework.web.server.ResponseStatusException;

public class ServerNotFoundException extends ResponseStatusException {
    public ServerNotFoundException(String message) {
        super(org.springframework.http.HttpStatus.NOT_FOUND, message);
    }
}
