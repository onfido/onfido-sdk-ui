package com.onfido.qa.websdk.sdk;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(using = RawSerializer.class)
public class Raw {
    final String data;

    public Raw(String data) {
        this.data = data;
    }
}
