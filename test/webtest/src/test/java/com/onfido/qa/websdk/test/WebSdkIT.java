package com.onfido.qa.websdk.test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.onfido.qa.annotation.Browser;
import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.WebTest;
import com.onfido.qa.webdriver.common.Component;
import com.onfido.qa.webdriver.common.Page;
import com.onfido.qa.webdriver.listener.BrowserStackListener;
import com.onfido.qa.webdriver.listener.ScreenshotListener;
import com.onfido.qa.websdk.Property;
import com.onfido.qa.websdk.sdk.WebSdk;
import io.percy.selenium.Percy;
import org.openqa.selenium.Point;
import org.openqa.selenium.WindowType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Listeners;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Properties;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@Listeners({ScreenshotListener.class, BrowserStackListener.class})
@Browser(acceptInsureCertificates = true)
public abstract class WebSdkIT extends WebTest {

    public static final String WITHOUT_VIDEO_CSS = "video.onfido-sdk-ui-Camera-video { display: none; }";

    private static final int MIN = 500;
    private static final int SLEEP_BEFORE_SNAPSHOT = 250;

    private static final Logger log = LoggerFactory.getLogger(WebSdkIT.class);


    static ObjectMapper objectMapper = new ObjectMapper();
    protected final String language;
    protected final Copy copy;
    private static final ThreadLocal<Percy> percy = new ThreadLocal<>();
    private String mainScreenHandle;
    private String mobileScreenHandle;

    protected WebSdkIT() {
        this(defaultLanguage());
    }

    protected WebSdkIT(String language) {
        this.language = language;
        this.copy = copy(language);
    }

    @BeforeSuite(alwaysRun = true)
    public static void beforeSuite() {

        if (!System.getenv().containsKey("CI")) {
            logProperties();
        }
    }

    @SuppressWarnings("HardcodedLineSeparator")
    private static void logProperties() {
        log.debug("Properties: {}", Property.properties().entrySet()
                                            .stream()
                                            .map(x -> x.getKey() + "=" + x.getValue())
                                            .collect(Collectors.joining("\n")));
    }

    @DataProvider
    public static Object[][] booleans() {
        return new Object[][]{{true}, {false}};
    }

    @Override
    protected Properties properties() {
        return Property.properties();
    }

    @SuppressWarnings("CallToSystemGetenv")
    @Override
    protected void extendCapabilities(DesiredCapabilities capabilities) {
        // https://www.browserstack.com/docs/automate/selenium/debugging-options#network-logs

        capabilities.setCapability("browserstack.debug", "true");
        capabilities.setCapability("browserstack.console", "warnings");
        capabilities.setCapability("browserstack.networkLogs", "true");
        capabilities.setCapability("browserstack.wsLocalSupport", "true");

        capabilities.setCapability("project", "web-sdk");
        capabilities.setCapability("build", System.getenv("BUILD"));


        // TODO: pass app id to env variable
        var appId = Property.get("BROWSERSTACK_APP_ID");
        if (appId != null) {
            capabilities.setCapability("app", appId);
        }
    }

    @BeforeMethod
    public void beforeMethod() {
        percy.set(new Percy(driver()));

        driver().waitFor.timeout(5);
        driver().driver.manage().window().setPosition(new Point(0, 0));
        driver().maximize();
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        percy.remove();
    }

    protected static String defaultLanguage() {
        return Property.get("defaultLanguage", "en_US");
    }

    protected Driver driver() {
        return WebTest.d();
    }

    protected WebSdk onfido() {
        return new WebSdk(driver()).withLanguage(language);
    }

    protected final Copy copy(String language) {

        JsonNode tree;

        try {
            tree = objectMapper.readTree(new File(String.format("../../src/locales/%s/%s.json", language, language)));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return new Copy(tree);
    }


    public static class Copy {
        private final JsonNode tree;

        public Copy(JsonNode tree) {
            this.tree = tree;
        }

        public String get(String path) {
            return this.tree.at("/" + String.join("/", path.split("\\."))).textValue();
        }

    }

    protected void verifyCopy(String actual, String path) {
        assertThat(actual).isEqualTo(copy.get(path));
    }

    protected void takePercySnapshot(String name) {
        takePercySnapshot(name, null);
    }

    protected void takePercySnapshot(String name, String css) {
        try {
            Thread.sleep(SLEEP_BEFORE_SNAPSHOT);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        percy.get().snapshot(String.format("%s-%s", name, language), Arrays.asList(MIN), null, false, css);
    }

    protected void takePercySnapshotWithoutVideo(String name) {
        takePercySnapshot(name, WITHOUT_VIDEO_CSS);
    }

    protected <T extends Page> T verifyPage(Class<T> page) {
        return Component.createComponent(driver(), page);
    }

    protected void disableWebcam() {
        driver().executeScript("window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([])");
    }

    protected void provideVideoDevice() {
        // TODO: check, if this is needed. The browsers itself have video
        driver().executeScript("window.navigator.mediaDevices =  window.navigator.mediaDevices || {}; window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: \"video\" }])");
    }

    protected void disableMediaRecorder() {
        driver().executeScript("delete window.MediaRecorder");
    }

    protected void switchToMobileScreen() {
        driver().switchTo().window(mobileScreenHandle);
    }

    protected void switchToMainScreen() {
        driver().switchTo().window(mainScreenHandle);
    }

    protected void openMobileScreen(String url) {

        var driver = driver().driver;
        mainScreenHandle = driver.getWindowHandle();

        driver.switchTo().newWindow(WindowType.TAB);
        mobileScreenHandle = driver.getWindowHandle();
        driver().get(url);
    }
}
