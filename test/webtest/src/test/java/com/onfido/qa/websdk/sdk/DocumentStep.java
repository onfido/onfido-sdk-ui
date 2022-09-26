package com.onfido.qa.websdk.sdk;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.onfido.qa.websdk.DocumentType;

import java.util.HashMap;
import java.util.Map;

public class DocumentStep extends Step {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Options {

        @JsonProperty
        private Boolean useLiveDocumentCapture;

        @JsonProperty
        private Boolean uploadFallback;

        @JsonProperty
        private Boolean useWebcam;

        @JsonProperty
        private Map<String, Object> documentTypes;

        @JsonProperty
        private Boolean forceCrossDevice;

        @JsonProperty
        private Variant requestedVariant;

    }

    public static class Option {

        @JsonProperty
        private final String country;

        public Option(String country) {
            this.country = country;
        }
    }

    @JsonProperty("options")
    private final Options options = new Options();

    @Override
    public String type() {
        return "document";
    }

    public enum Variant {
        @JsonProperty("video")
        VIDEO,

        @JsonProperty("standard")
        STANDARD
    }

    public DocumentStep withUseLiveDocumentCapture(Boolean useLiveDocumentCapture) {
        this.options.useLiveDocumentCapture = useLiveDocumentCapture;
        return this;
    }

    public DocumentStep withUploadFallback(Boolean uploadFallback) {
        this.options.uploadFallback = uploadFallback;
        return this;
    }

    public DocumentStep withUseWebcam(Boolean useWebcam) {
        this.options.useWebcam = useWebcam;
        return this;
    }

    public DocumentStep withDocumentType(DocumentType documentType) {
        return this.withDocumentType(documentType, true);
    }

    public DocumentStep withDocumentType(DocumentType documentType, Object option) {

        if (this.options.documentTypes == null) {
            this.options.documentTypes = new HashMap<>();
        }

        this.options.documentTypes.put(documentType.canonicalName(), option);
        return this;
    }

    public DocumentStep withoutDocumentType(DocumentType documentType) {

        if (this.options.documentTypes == null) {
            this.options.documentTypes = new HashMap<>();
        }

        this.options.documentTypes.put(documentType.canonicalName(), false);
        return this;
    }

    public DocumentStep withForceCrossDevice(Boolean forceCrossDevice) {
        this.options.forceCrossDevice = forceCrossDevice;
        return this;
    }

    public DocumentStep withRequestedVariant(Variant requestedVariant) {
        this.options.requestedVariant = requestedVariant;
        return this;
    }

}
