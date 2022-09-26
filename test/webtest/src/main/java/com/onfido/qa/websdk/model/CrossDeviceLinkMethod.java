package com.onfido.qa.websdk.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum CrossDeviceLinkMethod {

    @JsonProperty("copy_link")
    COPY_LINK("copyLinkOption"),

    @JsonProperty("qr_code")
    QR_CODE("qrCodeLinkOption"),

    @JsonProperty("sms")
    SMS("smsLinkOption");

    public final String className;

    CrossDeviceLinkMethod(String className) {

        this.className = className;
    }
}
