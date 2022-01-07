package com.onfido.qa.websdk.api;

import com.fasterxml.jackson.annotation.JsonProperty;

@SuppressWarnings("unused")
public class SdkToken {

    @JsonProperty("application_id")
    private String applicantId;

    @JsonProperty("message")
    private String token;

    public String applicantId() {
        return applicantId;
    }

    public String token() {
        return token;
    }
}
