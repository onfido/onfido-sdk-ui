package com.onfido.qa.websdk.mock;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@SuppressWarnings("PublicField")
public class ProfileData {

    @JsonProperty
    public List<String> addresses;

    @JsonProperty("client_id")
    public String clientId;

    @JsonProperty
    public String dob;

    @JsonProperty
    public String email;

    @JsonProperty("first_name")
    public String firstName;

    @JsonProperty("last_name")
    public String lastName;

    @JsonProperty
    public String uuid;
}
