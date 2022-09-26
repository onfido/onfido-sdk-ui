package com.onfido.qa.websdk.sdk;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.onfido.qa.webdriver.Driver;

public class Onfido {

    private final Driver driver;
    private final static ObjectMapper objectMapper = new ObjectMapper();

    public Onfido(Driver driver) {
        this.driver = driver;
    }

    public Onfido setOption(String option, Object value) {

        try {
            driver.executeScript(String.format("window.onfido.setOptions({%s: %s});", option, objectMapper.writeValueAsString(value)));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        return this;
    }

}
