package com.onfido.qa.websdk.api;

public class HttpError extends RuntimeException {

    private final int statusCode;

    public HttpError(int statusCode) {
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
