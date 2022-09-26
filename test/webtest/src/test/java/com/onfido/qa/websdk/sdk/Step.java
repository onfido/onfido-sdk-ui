package com.onfido.qa.websdk.sdk;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public abstract class Step {

    @JsonProperty()
    public abstract String type();
}
