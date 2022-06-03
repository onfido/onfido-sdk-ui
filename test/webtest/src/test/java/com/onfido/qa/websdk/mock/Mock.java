package com.onfido.qa.websdk.mock;

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
    }

    public Mock(RemoteWebDriver driver) {
        this.driver = driver;
    }

    public Mock extend(Code code, String payload) {
        return perform(true, code, payload);
    }

    public Mock extend(Code code, Object object) {
        return perform(true, code, object);
    }

    public Mock set(Code code, String payload) {
        return perform(false, code, payload);
    }

    public Mock set(Code code, Object object) {
        return perform(false, code, object);
    }

    private Mock perform(boolean extend, Code code, Object object) {
        try {
            return perform(extend, code, objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(object));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private Mock perform(boolean extend, Code code, String payload) {
        var url = String.format("/mock/%s", code.code);
        var sessionId = driver.getSessionId().toString();
        var method = extend ? "PATCH" : "PUT";

        if (extend) {
            log.info("Extending response payload for {} with {}", code, payload);
        } else {
            log.info("Setting response payload for {} to {}", code, payload);
        }

        driver.executeScript("return window.request.apply(window, Array.prototype.slice.call(arguments))", method, url, sessionId, payload);

        return this;
    }
}
