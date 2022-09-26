package com.onfido.qa.websdk.mock;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Consent {

    @JsonProperty
    private String name;

    @JsonProperty
    private boolean granted;

    @JsonProperty
    private boolean required = true;

    public Consent(String name) {
        this.name = name;
    }

    public Consent withGranted(boolean granted) {
        this.granted = granted;
        return this;
    }

    public Consent withRequired(boolean required) {
        this.required = required;
        return this;
    }
}
