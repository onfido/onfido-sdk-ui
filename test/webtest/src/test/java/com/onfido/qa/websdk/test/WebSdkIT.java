package com.onfido.qa.websdk.test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.onfido.qa.annotation.Browser;
import com.onfido.qa.webdriver.WebTest;
import com.onfido.qa.webdriver.listener.BrowserStackListener;
import com.onfido.qa.webdriver.listener.ScreenshotListener;
import com.onfido.qa.configuration.Property;
import com.onfido.qa.websdk.mock.Mock;
import com.onfido.qa.websdk.sdk.WebSdk;
import io.github.bonigarcia.wdm.WebDriverManager;
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
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@Listeners({ScreenshotListener.class, BrowserStackListener.class})
@Browser(acceptInsureCertificates = true)
public abstract class WebSdkIT extends WebTest {

    private static final String WITHOUT_VIDEO_CSS = "video.onfido-sdk-ui-Camera-video { display: none; }";
    private static final String HIDE_QR_CODE = ".onfido-sdk-ui-crossDevice-CrossDeviceLink-qrCodeContainer {visibility: hidden}";

    private static final int MIN = 500;
    private static final int SLEEP_BEFORE_SNAPSHOT = 250;

    private static final Logger log = LoggerFactory.getLogger(WebSdkIT.class);


    static ObjectMapper objectMapper = new ObjectMapper();
    protected final String language;
    protected final Copy copy;
    private static final ThreadLocal<Percy> percy = new ThreadLocal<>();

    private static final ThreadLocal<String> mainScreenHandle = new ThreadLocal<>();
    private static final ThreadLocal<String> mobileScreenHandle = new ThreadLocal<>();

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

        setupDriverAutomatically();
    }

    private static void setupDriverAutomatically() {
        String browserName = Property.get("browser");

        if (browserName.equals("ie")) {
            browserName = "internet explorer";
        }

        WebDriverManager.getInstance(browserName).setup();
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

    @SuppressWarnings("CallToSystemGetenv")
    @Override
    protected DesiredCapabilities extendCapabilities(DesiredCapabilities capabilities) {
        // https://www.browserstack.com/docs/automate/selenium/debugging-options#network-logs

        capabilities.setCapability("browserstack.debug", "true");
        capabilities.setCapability("browserstack.console", "warnings");
        capabilities.setCapability("browserstack.networkLogs", properties().getProperty("networkLogs", "true"));
        capabilities.setCapability("browserstack.wsLocalSupport", "true");
        capabilities.setCapability("acceptSslCerts", "true");

        capabilities.setCapability("project", "web-sdk");
        capabilities.setCapability("build", System.getenv("BUILD"));


        // TODO: pass app id to env variable
        var appId = Property.get("BROWSERSTACK_APP_ID");
        if (appId != null) {
            capabilities.setCapability("app", appId);
        }

        return capabilities;
    }

    @BeforeMethod(alwaysRun = true)
    public void beforeMethod() {

        driver().waitFor.timeout(15);
        driver().driver.manage().window().setPosition(new Point(0, 0));
        driver().maximize();

        percy.set(new Percy(driver()));
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        percy.remove();
    }

    protected static String defaultLanguage() {
        return Property.get("defaultLanguage", "en_US");
    }

    protected WebSdk onfido() {
        return new WebSdk(driver()).withLanguage(language);
    }

    protected Mock mock() {
        return new Mock(driver().driver);
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

    protected void takePercySnapshotWithoutQRCode(String name) {
        takePercySnapshot(name, HIDE_QR_CODE);
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

    protected void disableMediaRecorder() {
        driver().executeScript("delete window.MediaRecorder");
    }

    protected void switchToMobileScreen() {
        driver().switchTo().window(mobileScreenHandle.get());
    }

    protected void switchToMainScreen() {
        driver().switchTo().window(mainScreenHandle.get());
    }

    protected void openMobileScreen(String url) {

        var driver = driver().driver;
        mainScreenHandle.set(driver.getWindowHandle());

        driver.switchTo().newWindow(WindowType.TAB);
        mobileScreenHandle.set(driver.getWindowHandle());
        driver().get(url);
    }
}
