package com.onfido.qa.websdk.model;

import com.fasterxml.jackson.annotation.JsonProperty;

@SuppressWarnings("PublicField")
public class CompleteData {

    @JsonProperty
    public Document poa;

    @JsonProperty
    public Document document_front;

    @JsonProperty
    public Document document_back;

    public static class Document {

        @JsonProperty
        public String id;

        @JsonProperty
        public String type;

        @JsonProperty
        public String side;

        @JsonProperty
        public String variant;
    }
}
