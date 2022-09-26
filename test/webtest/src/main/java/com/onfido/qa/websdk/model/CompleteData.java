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

    @JsonProperty
    public Face face;

    public static class Face {

        @JsonProperty
        public String id;

        @JsonProperty
        public String variant;
    }

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
