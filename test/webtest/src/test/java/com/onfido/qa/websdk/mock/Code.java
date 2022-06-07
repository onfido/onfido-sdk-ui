package com.onfido.qa.websdk.mock;

public enum Code {
    SDK_CONFIGURATION("sdkConfiguration"),
    CONSENTS("consents"),
    WORKFLOW_RUN_COMPLETE("workflowRunComplete"),
    WORKFLOW_RUN("workflowRun");

    public final String code;

    Code(String code) {
        this.code = code;
    }
}
