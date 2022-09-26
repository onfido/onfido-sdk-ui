package com.onfido.qa.websdk.mock;

import com.fasterxml.jackson.annotation.JsonProperty;

@SuppressWarnings("PublicField")
public class SdkConfiguration {

    @JsonProperty("sdk_features")
    public SdkFeatures sdkFeatures = new SdkFeatures();

    @SuppressWarnings("PublicField")
    public static class SdkFeatures {

        @JsonProperty("enable_require_applicant_consents")
        public Boolean enableRequireApplicantConsents;
    }

    public SdkConfiguration withEnableRequireApplicantConsents(boolean value) {
        sdkFeatures.enableRequireApplicantConsents = value;
        return this;
    }
}
