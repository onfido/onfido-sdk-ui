package com.onfido.qa.websdk.mock;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum State {

    @JsonProperty("in_progress")
    IN_PROGRESS,

    @JsonProperty("awaiting_applicant")
    AWAITING_APPLICANT,

    @JsonProperty("complete")
    COMPLETE,
    @JsonProperty("withdrawn")
    WITHDRAWN,
    @JsonProperty("paused")
    PAUSED,
    @JsonProperty("reopened")
    REOPENED;
}
