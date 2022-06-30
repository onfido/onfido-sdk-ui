package com.onfido.qa.websdk.test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.onfido.qa.annotation.Browser;
import com.onfido.qa.websdk.PoADocumentType;
import com.onfido.qa.websdk.UploadDocument;
import com.onfido.qa.websdk.page.Complete;
import com.onfido.qa.websdk.page.CrossDeviceClientIntro;
import com.onfido.qa.websdk.page.CrossDeviceLink;
import com.onfido.qa.websdk.page.CrossDeviceMobileConnected;
import com.onfido.qa.websdk.page.CrossDeviceSubmit;
import com.onfido.qa.websdk.page.DocumentUpload;
import com.onfido.qa.websdk.page.FaceVideo;
import com.onfido.qa.websdk.page.FaceVideoIntro;
import com.onfido.qa.websdk.page.ImageQualityGuide;
import com.onfido.qa.websdk.page.PoADocumentSelection;
import com.onfido.qa.websdk.page.PoAIntro;
import com.onfido.qa.websdk.page.RestrictedDocumentSelection;
import com.onfido.qa.websdk.page.SelfieCamera;
import com.onfido.qa.websdk.page.SelfieIntro;
import com.onfido.qa.websdk.page.Welcome;
import com.onfido.qa.websdk.sdk.FaceStep;
import org.openqa.selenium.By;
import org.openqa.selenium.WindowType;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Objects;

import static com.onfido.qa.websdk.DocumentType.DRIVING_LICENCE;
import static com.onfido.qa.websdk.DocumentType.PASSPORT;
import static com.onfido.qa.websdk.sdk.FaceStep.Variant.VIDEO;
import static org.assertj.core.api.Assertions.assertThat;

// TODO: add tests for all pages. e.g. run the report from other tests or add tests here. Same as with percy

@SuppressWarnings("RedundantFieldInitialization")
public class AccessibilityIT extends WebSdkIT {

    static String axe = null;
    static String axeConfig = null;
    static final ObjectMapper objectMapper = new ObjectMapper();

    static {
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @BeforeClass(alwaysRun = true)
    @SuppressWarnings("ConstantConditions")
    public static void beforeClass() throws IOException, URISyntaxException {
        axe = Files.readString(Paths.get(AccessibilityIT.class.getClassLoader().getResource("axe.min.js").toURI()));
        axeConfig = Files.readString(Paths.get(AccessibilityIT.class.getClassLoader().getResource("axe.config.json").toURI()));
    }

    private void verifyAxeReport() {

        driver().executeScript(Objects.requireNonNull(axe));
        driver().executeScript("axe.configure(" + axeConfig + ");");
        String result = String.valueOf(driver().executeAsyncScript("var callback = arguments[arguments.length - 1]; axe.run().then(results => callback(JSON.stringify(results, null, 4)));"));

        JsonNode report;
        try {
            report = objectMapper.readTree(result);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        var violations = (ArrayNode) report.get("violations");

        //noinspection HardcodedLineSeparator
        assertThat(violations).withFailMessage(("Found violations with axe\n\n" + result)).isEmpty();

    }

    @Test(description = "should verify focus management for the welcome screen")
    public void testShouldVerifyFocusManagementForTheWelcomeScreen() {
        onfido().withSteps("welcome").init(Welcome.class);

        var title = driver().findElement(By.cssSelector(".onfido-sdk-ui-PageTitle-titleSpan"));
        driver().executeScript("arguments[0].setAttribute('focussed', 'true')", title);

        var activeElement = driver().switchTo().activeElement();
        assertThat(activeElement.getAttribute("focussed")).isEqualTo("true");
    }

    @Test(description = "should verify accessibility for the welcome screen")
    public void testWelcomeScreen() {
        onfido().withSteps("welcome").init(Welcome.class);
        verifyAxeReport();
    }

    @Test
    public void testCrossDeviceIntro() {
        onfido().withSteps("document")
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, DocumentUpload.class)
                .switchToCrossDevice();

        verifyAxeReport();
    }

    private CrossDeviceLink gotoCrossDeviceLinkScreen() {
        return onfido().withSteps("document")
                       .init(RestrictedDocumentSelection.class)
                       .selectSupportedCountry()
                       .selectDocument(PASSPORT, DocumentUpload.class)
                       .switchToCrossDevice()
                       .getSecureLink();
    }

    @Test(description = "should verify accessibility for the cross device screen")
    public void testCrossDeviceScreen() {
        gotoCrossDeviceLinkScreen();

        verifyAxeReport();
    }

    @Test(description = "should verify accessibility for the cross device mobile connected screen")
    public void testShouldVerifyAccessibilityForTheCrossDeviceMobileConnectedScreen() {
        var link = gotoCrossDeviceLinkScreen().copyLink();

        driver().driver.switchTo().newWindow(WindowType.TAB);
        driver().get(link);

        verifyPage(CrossDeviceClientIntro.class);

        verifyAxeReport();
    }

    @Test(description = "should verify accessibility for the cross device mobile notification sent screen")
    public void testShouldVerifyAccessibilityForTheCrossDeviceMobileNotificationSentScreen() {

        gotoCrossDeviceLinkScreen().clickSmsOption();
        verifyAxeReport();
    }

    @Test(description = "should verify accessibility for the cross device submit screen", groups = {"tabs"})
    public void testShouldVerifyAccessibilityForTheCrossDeviceSubmitScreen() {

        // TODO: would be good to test it on a real device without the useUploader=true option

        var link = onfido().withSteps(new FaceStep().withUseUploader(true))
                           .init(DocumentUpload.class)
                           .continueOnPhone()
                           .getSecureLink()
                           .copyLink();

        openMobileScreen(link);
        driver().get(link);

        switchToMainScreen();
        verifyPage(CrossDeviceMobileConnected.class);

        switchToMobileScreen();
        verifyPage(DocumentUpload.class).upload(UploadDocument.FACE).clickConfirmButton(null);

        switchToMainScreen();
        verifyPage(CrossDeviceSubmit.class);

        verifyAxeReport();

    }

    // https://github.com/alphagov/accessible-autocomplete/issues/361
    // Disabling until we replace autocomplete
    // FIXME: bug
    @Test(enabled=false, description = "should verify accessibility for the document selector screen")
    public void testShouldVerifyAccessibilityForTheDocumentSelectorScreen() {
        onfido().withSteps("document").init(RestrictedDocumentSelection.class).selectSupportedCountry();
        verifyAxeReport();
    }

    @Test(description = "should verify accessibility for the passport upload image guide screen")
    public void testShouldVerifyAccessibilityForThePassportUploadImageGuideScreen() {
        onfido().withSteps("document")
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, DocumentUpload.class)
                .clickUploadButton(ImageQualityGuide.class);

        verifyAxeReport();

    }

    // https://github.com/alphagov/accessible-autocomplete/issues/361
    // FIXME: bug
    @Test(description = "should verify accessibility for country selector screen", enabled = false)
    public void testAccessibilityForCountrySelector() {
        onfido().withSteps("document").init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(DRIVING_LICENCE, DocumentUpload.class);

        verifyAxeReport();
    }

    @Test(description = "should verify accessibility for the document uploader screen")
    public void testShouldVerifyAccessibilityForTheDocumentUploaderScreen() {
        onfido().withSteps("document").init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(DRIVING_LICENCE, DocumentUpload.class);

        verifyAxeReport();
    }

    @Test(description = "should verify accessibility for the document upload confirmation screen")
    public void testShouldVerifyAccessibilityForTheDocumentUploadConfirmationScreen() {

        onfido().withSteps("document")
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, DocumentUpload.class)
                .clickUploadButton(ImageQualityGuide.class)
                .upload(UploadDocument.PASSPORT_JPG);

        verifyAxeReport();

    }

    @Test(description = "should verify accessibility for the selfie confirmation screen")
    @Browser(enableMicrophoneCameraAccess = true)
    public void testShouldVerifyAccessibilityForTheSelfieConfirmationScreen() {
        var selfieCamera = onfido().withSteps("face")
                                   .init(SelfieIntro.class)
                                   .clickContinue(SelfieCamera.class);

        verifyAxeReport();

        selfieCamera.record();

        verifyAxeReport();
    }

    @Test(description = "should verify accessibility for faceVideo intro screen")
    public void testShouldVerifyAccessibilityForFaceVideoIntroScreen() {

        onfido().withSteps(new FaceStep().withRequestedVariant(VIDEO))
                .init(FaceVideoIntro.class);

        verifyAxeReport();
    }

    @Test(description = "should verify accessibility for camera permission screen")
    public void testShouldVerifyAccessibilityForCameraPermissionScreen() {

        onfido().withSteps(new FaceStep().withRequestedVariant(VIDEO))
                .init(FaceVideoIntro.class)
                .recordVideo();

        verifyAxeReport();

    }

    @Test(description = "should verify accessibility for faceVideo recording and faceVideo confirmation screens")
    @Browser(enableMicrophoneCameraAccess = true)
    public void testShouldVerifyAccessibilityForFaceVideoRecordingAndFaceVideoConfirmationScreens() {
        var camera = onfido().withSteps(new FaceStep().withRequestedVariant(VIDEO))
                             .init(FaceVideoIntro.class)
                             .recordVideo(FaceVideo.class);

        verifyAxeReport();

        camera.record();

        verifyAxeReport();

    }

    @Test(description = "should verify accessibility for verification complete screen")
    public void testShouldVerifyAccessibilityForVerificationCompleteScreen() {
        onfido().withSteps("complete").init(Complete.class);

        verifyAxeReport();
    }

    @Test(description = "should verify accessibility for PoA Intro screen")
    public void testShouldVerifyAccessibilityForPoAIntroScreen() {
        onfido().withSteps("poa").init(PoAIntro.class);
        verifyAxeReport();
    }

    @Test(description = "should verify accessibility for PoA Document Selection screen")
    public void testShouldVerifyAccessibilityForPoADocumentSelectionScreen() {
        onfido()
                .withSteps("poa")
                .init(PoAIntro.class)
                .startVerification()
                .select("United", PoADocumentSelection.class);

        verifyAxeReport();
    }

    @Test(description = "should verify accessibility for PoA Document Guidance screen")
    public void testShouldVerifyAccessibilityForPoADocumentGuidanceScreen() {

        onfido().withSteps("poa").init(PoAIntro.class)
                .startVerification()
                .select("United", PoADocumentSelection.class)
                .select(PoADocumentType.BENEFIT_LETTERS);

        verifyAxeReport();

    }

    @Test(description = "should verify accessibility for modal screen")
    public void testShouldVerifyAccessibilityForModalScreen() {

        var onfido = onfido().withUseModal().withSteps("welcome").init();
        onfido.setOption("isModalOpen", true);

        verifyPage(Welcome.class);

        verifyAxeReport();

    }

    @Test(description = "should verify accessibility for the take a selfie screen")
    public void testShouldVerifyAccessibilityForTheTakeASelfieScreen() {
        onfido().withSteps("face").init();
        verifyAxeReport();
    }


}
