package com.onfido.qa.websdk.mock;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings("OverloadedMethodsWithSameNumberOfParameters")
public class Mock {

    private final RemoteWebDriver driver;

    private static final Logger log = LoggerFactory.getLogger(Mock.class);

    private final static ObjectMapper objectMapper;

    static {
        objectMapper = new ObjectMapper();
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    }

    public Mock(RemoteWebDriver driver) {
        this.driver = driver;
    }

    public Mock response(Code code, int statusCode) {
        return perform(false, code, "", statusCode);
    }

    public Mock extend(Code code, String payload) {
        return perform(true, code, payload, null);
    }

    public Mock extend(Code code, Object object) {
        return perform(true, code, object, null);
    }

    public Mock set(Code code, String payload) {
        return perform(false, code, payload, null);
    }

    public Mock set(Code code, Object object) {
        return perform(false, code, object, null);
    }

    private Mock perform(boolean extend, Code code, Object object, Integer statusCode) {
        try {
            return perform(extend, code, objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(object), statusCode);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private Mock perform(boolean extend, Code code, String payload, Integer statusCode) {
        var url = String.format("/mock/%s", code.code);
        var sessionId = driver.getSessionId().toString();
        var method = extend ? "PATCH" : "PUT";

        if (extend) {
            log.info("Extending response payload for {} with {}", code, payload);
        } else {
            log.info("Setting response payload for {} to {}", code, payload);
        }

        driver.executeScript("return window.request.apply(window, Array.prototype.slice.call(arguments))", method, url, sessionId, payload, statusCode);

        return this;
    }
}
