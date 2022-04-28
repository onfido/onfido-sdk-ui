package com.onfido.qa.websdk.sdk;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Component;
import com.onfido.qa.webdriver.common.Page;
import com.onfido.qa.webdriver.driver.ExpectedConditions;
import com.onfido.qa.configuration.Property;
import com.onfido.qa.websdk.model.CrossDeviceLinkMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SuppressWarnings({"SameParameterValue", "BooleanParameter"})
public class WebSdk {

    private static final Logger log = LoggerFactory.getLogger(WebSdk.class);
    private final static ObjectMapper objectMapper;

    static {
        objectMapper = new ObjectMapper();
    }

    private final Map<String, Object> parameters = new HashMap<>();
    private final Driver driver;
    private boolean tokenSet;
    private final List<Runnable> beforeInit = new ArrayList<>();
    private boolean enableWebcam = true;

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

    public WebSdk beforeInit(Runnable run) {
        beforeInit.add(run);
        return this;
    }

    public WebSdk withCrossDeviceLinkMethods(CrossDeviceLinkMethod... methods) {
        put("_crossDeviceLinkMethods", Arrays.asList(methods));
        return this;
    }

    public WebSdk withCrossDeviceLinkMethods(String... methods) {
        put("_crossDeviceLinkMethods", Arrays.asList(methods));
        return this;
    }

    public WebSdk withCrossDeviceClientIntroProductName(String productName) {
        put("crossDeviceClientIntroProductName", productName);
        return this;
    }

    public WebSdk withCrossDeviceClientIntroProductLogoSrc(String url) {
        put("crossDeviceClientIntroProductLogoSrc", url);
        return this;
    }

    public WebSdk withOnComplete(Raw raw) {
        put("onComplete", raw);
        return this;
    }

    public WebSdk withEnableWebcam() {
        enableWebcam = true;
        return this;
    }

    public WebSdk withDisableWebcam() {
        enableWebcam = false;
        return this;
    }

    private void setupDefaultValues() {
        withSteps("welcome", "document");
        put("containerId", "root");
        withDisableAnalytics();
        withEnableWebcam();
    }

    private void withDisableAnalytics() {
        withDisableAnalytics(true);
    }

    private void withDisableAnalytics(boolean value) {
        put("disableAnalytics", value);
    }

    public WebSdk withToken(String token) {
        parameters.put("token", token);
        tokenSet = true;
        return this;
    }

    public WebSdk withSdkConfiguration(Map<String,Object> sdkConfiguration) {
       parameters.put("overrideSdkConfiguration", sdkConfiguration);
       return this;
    }

    private WebSdk put(String key, Object value) {
        parameters.put(key, value);
        return this;
    }

    public WebSdk withLanguage(String language) {
        return put("language", language);
    }

    public WebSdk withEnterpriseFeatures(EnterpriseFeatures enterpriseFeatures) {
        return put("enterpriseFeatures", enterpriseFeatures);
    }

    public WebSdk withSteps(Object... steps) {
        return put("steps", Arrays.stream(steps).toArray());
    }

    public Onfido init() {

        // navigate to the base url
        driver.get(Property.get("baseUrl"));

        if (!tokenSet) {
            withToken(getToken());
        }

        if (!driver.driver.getCapabilities().getBrowserName().equalsIgnoreCase("internet explorer")) {
            setupWebcam();
        }

        beforeInit.forEach(Runnable::run);

        // and wait for the page to be ready
        driver.waitFor(ExpectedConditions.pageReady());
        // then call the onfido.init method with the parameters

        var parameters = serializedParameters();
        log.info("Initializing web sdk with: Onfido.init({})", parameters);

        driver.executeScript("window.onfido = Onfido.init(" + parameters + ")");

        return new Onfido(driver);
    }

    private void setupWebcam() {
        if (enableWebcam) {
            if (getVideoDeviceCount() == 0) {
                log.info("Faking enumerateDevices to return a video device");
                driver.executeScript("window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: \"video\" }])");
            }

        } else {
            driver.executeScript("window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([])");
        }
    }

    private Long getVideoDeviceCount() {
        return (Long) driver.executeAsyncScript("var callback = arguments[arguments.length - 1];" +
                "window.navigator.mediaDevices.enumerateDevices()" +
                ".then(devices => { " +
                "callback(devices.filter(x => x.kind.indexOf('video') !== -1).length)" +
                "})" +
                ".catch(() => callback(0))");
    }

    private String getToken() {
        return (String) driver.executeScript("return window.getToken()");
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
