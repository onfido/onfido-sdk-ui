package com.onfido.qa.websdk.test;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.websdk.DocumentType;
import com.onfido.qa.websdk.UploadDocument;
import com.onfido.qa.websdk.page.*;
import org.testng.annotations.Test;

import java.util.Properties;

import static com.onfido.qa.websdk.DocumentType.PASSPORT;

public class HostedAppHistoryIT extends WebSdkIT {

    @Test(description = "it should have pre-verification steps when host app has history")
    public void testItShouldHavePreVerificationStepsWhenHostAppHasHistory() {
        hostedApp().useHistory().open();

        verifyPage(HostedAppStep1.class)
                .next()
                .startVerification()
                .continueToNextStep();
    }

    @Test(description = "it can navigate forward and back when host app has history")
    public void testItCanNavigateForwardAndBackWhenHostAppHasHistory() {
        hostedApp().useHistory().open();

        verifyPage(HostedAppStep1.class)
                .next()
                .startVerification()
                .continueToNextStep(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, DocumentUpload.class)
                .clickUploadButton(ImageQualityGuide.class)
                .upload(UploadDocument.PASSPORT_JPG)
                .clickConfirmButton(DocumentUpload.class)
                .upload(UploadDocument.FACE)
                .back(DocumentUpload.class)
                .back(ConfirmUpload.class)
                .back(ImageQualityGuide.class)
                .back(DocumentUpload.class)
                .back(RestrictedDocumentSelection.class)
                .back(Welcome.class);

    }

    @Test(description = "by default the SDK back button and the browser back behave consistently")
    public void testByDefaultTheSdkBackButtonAndTheBrowserBackBehaveConsistently() {
        hostedApp().useHistory().open();

        verifyPage(HostedAppStep1.class)
                .next()
                .startVerification()
                .continueToNextStep(RestrictedDocumentSelection.class)
                .back(Welcome.class)
                .continueToNextStep(RestrictedDocumentSelection.class);

        driver().navigate().back();

        verifyPage(Welcome.class);

    }

    @Test(description = "when using `useMemoryHistory` the SDK back button and the browser back behave inconsistently")
    public void testWhenUsingUseMemoryHistoryTheSdkBackButtonAndTheBrowserBackBehaveInconsistently() {
        hostedApp().useHistory().useMemoryHistory().open();

        verifyPage(HostedAppStep1.class)
                .next()
                .startVerification()
                .continueToNextStep(RestrictedDocumentSelection.class)
                .back(Welcome.class)
                .continueToNextStep(RestrictedDocumentSelection.class);

        driver().navigate().back();

        verifyPage(HostedAppStep2.class);

    }

    private HostedApp hostedApp() {
        return new HostedApp(driver(), properties());
    }

    private static final class HostedApp {

        private final Driver driver;
        private final Properties properties;

        private boolean useHistory;
        private boolean useMemoryHistory;

        private HostedApp(Driver driver, Properties properties) {
            this.driver = driver;
            this.properties = properties;
        }

        public HostedApp useHistory() {
            useHistory = true;
            return this;
        }

        public HostedApp useMemoryHistory() {
            this.useMemoryHistory = true;
            return this;
        }

        public void open() {
            driver.get(properties.getProperty("hostedUrl") + "?useUploader=true" +
                    (useHistory ? "&useHistory=true" : "") +
                    (useMemoryHistory ? "&useMemoryHistory=true" : ""));

            driver.executeScript("window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: \"video\" }])");
        }
    }
}
