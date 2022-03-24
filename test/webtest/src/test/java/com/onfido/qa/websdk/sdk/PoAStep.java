package com.onfido.qa.websdk.sdk;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@SuppressWarnings("WriteOnlyObject")
public class PoAStep extends Step {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Options {

        @JsonProperty
        private String country;

    }


    @JsonProperty("options")
    private final Options options = new Options();

    @Override
    public String type() {
        return "poa";
    }


    public PoAStep withCountry(String country) {
        this.options.country = country;
        return this;
    }

}
