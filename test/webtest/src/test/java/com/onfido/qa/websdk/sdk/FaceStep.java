package com.onfido.qa.websdk.sdk;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@SuppressWarnings({"WriteOnlyObject", "BooleanParameter"})
public class FaceStep extends Step {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Options {

        @JsonProperty
        private Boolean useUploader;

        @JsonProperty
        private Boolean forceCrossDevice;

        @JsonProperty
        private Variant requestedVariant;

        @JsonProperty
        private Boolean uploadFallback;

        @JsonProperty
        private Boolean useMultipleSelfieCapture;

        @JsonProperty
        private Boolean photoCaptureFallback;

    }


    @Override
    public String type() {
        return "face";
    }

    @JsonProperty("options")
    private final FaceStep.Options options = new FaceStep.Options();

    public FaceStep withRequestedVariant(Variant requestedVariant) {
        this.options.requestedVariant = requestedVariant;
        return this;
    }

    public FaceStep withUploadFallback(Boolean uploadFallback) {
        this.options.uploadFallback = uploadFallback;
        return this;
    }

    public FaceStep withUseMultipleSelfieCapture(Boolean useMultipleSelfieCapture) {
        this.options.useMultipleSelfieCapture = useMultipleSelfieCapture;
        return this;
    }

    public FaceStep withPhotoCaptureFallback(Boolean photoCaptureFallback) {
        this.options.photoCaptureFallback = photoCaptureFallback;
        return this;
    }

    public FaceStep withUseUploader(boolean useUploader) {
        this.options.useUploader = useUploader;
        return this;
    }

    public enum Variant {

        @JsonProperty("video")
        VIDEO,

        @JsonProperty("standard")
        STANDARD
    }
}
