package com.onfido.qa.websdk.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum CrossDeviceLinkMethod {

    @JsonProperty("copy_link")
    COPY_LINK("copyLinkOption", "copy_link"),

    @JsonProperty("qr_code")
    QR_CODE("qrCodeLinkOption", "qr_code"),

    @JsonProperty("sms")
    SMS("smsLinkOption", "sms");

    public final String className;
    public final String qaKey;

    CrossDeviceLinkMethod(String className, String qaKey) {

        this.className = className;
        this.qaKey = qaKey;
    }
}
