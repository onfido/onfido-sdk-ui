package com.onfido.qa.websdk.sdk;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Component;
import com.onfido.qa.webdriver.common.Page;
import com.onfido.qa.webdriver.driver.ExpectedConditions;
import com.onfido.qa.websdk.Property;
import com.onfido.qa.websdk.api.ApiClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class WebSdk {

    private static final Logger log = LoggerFactory.getLogger(WebSdk.class);
    private final static ObjectMapper objectMapper;
    private final static ApiClient apiClient;

    static {
        objectMapper = new ObjectMapper();

        // TODO: configure the endpoint for api usage
        apiClient = new ApiClient(getTokenEndpoint());
    }

    private static String getTokenEndpoint() {
        try {
            var url = new URL(Property.get("tokenUrl", Property.get("baseUrl")));

            return new URL(url.getProtocol(), url.getHost(), url.getPort(), "/").toString();
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }

    private final Map<String, Object> parameters = new HashMap<>();
    private final Driver driver;
    private boolean tokenSet;

    public WebSdk(Driver driver) {
        this.driver = driver;

        this.setupDefaultValues();
    }

    public WebSdk withUseModal() {
        put("useModal", true);
        put("onModalRequestClose", new Raw("() => {window.onfido.setOptions({isModalOpen: false});}"));

        return this;
    }

    public WebSdk withShouldCloseOnOverlayClick(boolean shouldCloseOnOverlayClick) {
        return put("shouldCloseOnOverlayClick", shouldCloseOnOverlayClick);
    }

    private void setupDefaultValues() {
        withSteps("welcome", "document");
        put("containerId", "root");
    }

    public WebSdk withToken(String token) {
        parameters.put("token", token);
        tokenSet = true;
        return this;
    }

    private WebSdk put(String key, Object value) {
        parameters.put(key, value);
        return this;
    }

    public WebSdk withLanguage(String language) {
        return put("language", language);
    }

    public WebSdk withSteps(Object... steps) {
        return put("steps", Arrays.stream(steps).toArray());
    }

    public Onfido init() {

        if (!tokenSet) {
            withToken(getToken());
        }

        // navigate to the base url
        driver.get(Property.get("baseUrl"));
        // and wait for the page to be ready
        driver.waitFor(ExpectedConditions.pageReady());
        // then call the onfido.init method with the parameters

        var parameters = serializedParameters();
        log.info("Initializing web sdk with: Onfido.init({})", parameters);

        driver.executeScript("window.onfido = Onfido.init(" + parameters + ")");

        return new Onfido(driver);
    }

    private String getToken() {
        return apiClient.sdkToken().token();
    }

    public <T extends Page> T init(Class<T> pageClass) {
        init();

        return Component.createComponent(driver, pageClass);
    }

    private String serializedParameters() {
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(parameters);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
