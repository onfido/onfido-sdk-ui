package com.onfido.qa.websdk.sdk;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class EnterpriseFeatures {

    @JsonProperty
    private Boolean hideOnfidoLogo;

    @JsonProperty
    private EnterpriseCobranding cobrand;

    @JsonProperty
    private EnterpriseLogo logoCobrand;

    @JsonProperty
    private Boolean useCustomizedApiRequests;

    @JsonProperty
    private Raw onSubmitDocument;

    @JsonProperty
    private Raw onSubmitSelfie;

    @JsonProperty
    private Raw onSubmitVideo;

    public EnterpriseFeatures withHideOnfidoLogo(Boolean hideOnfidoLogo) {
        this.hideOnfidoLogo = hideOnfidoLogo;
        return this;
    }

    public EnterpriseFeatures withCobrand(EnterpriseCobranding cobrand) {
        this.cobrand = cobrand;
        return this;
    }

    public EnterpriseFeatures withLogoCobrand(EnterpriseLogo logoCobrand) {
        this.logoCobrand = logoCobrand;
        return this;
    }

    public EnterpriseFeatures withUseCustomizedApiRequests(Boolean useCustomizedApiRequests) {
        this.useCustomizedApiRequests = useCustomizedApiRequests;
        return this;
    }

    public EnterpriseFeatures withOnSubmitDocument(Raw onSubmitDocument) {
        this.onSubmitDocument = onSubmitDocument;
        return this;
    }

    public EnterpriseFeatures withOnSubmitSelfie(Raw onSubmitSelfie) {
        this.onSubmitSelfie = onSubmitSelfie;
        return this;
    }

    public EnterpriseFeatures withOnSubmitVideo(Raw onSubmitVideo) {
        this.onSubmitVideo = onSubmitVideo;
        return this;
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class EnterpriseCobranding {

        @JsonProperty
        private String text;

        public EnterpriseCobranding(String text) {
            this.text = text;
        }
    }


    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class EnterpriseLogo {

        @JsonProperty
        private String lightLogoSrc;
        @JsonProperty
        private String darkLogoSrc;

        public EnterpriseLogo withLightLogoSrc(String lightLogoSrc) {
            this.lightLogoSrc = lightLogoSrc;
            return this;
        }

        public EnterpriseLogo withDarkLogoSrc(String darkLogoSrc) {
            this.darkLogoSrc = darkLogoSrc;
            return this;
        }
    }
}
