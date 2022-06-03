package com.onfido.qa.websdk.mock;

public enum Code {
    SDK_CONFIGURATION("sdkConfiguration"),
    CONSENTS("consents");

    public final String code;

    Code(String code) {
        this.code = code;
    }
}
