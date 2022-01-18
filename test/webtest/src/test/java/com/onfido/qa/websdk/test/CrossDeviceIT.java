package com.onfido.qa.websdk.test;

import com.onfido.qa.websdk.UploadDocument;
import com.onfido.qa.websdk.page.CrossDeviceClientIntro;
import com.onfido.qa.websdk.page.CrossDeviceIntro;
import com.onfido.qa.websdk.page.CrossDeviceLink;
import com.onfido.qa.websdk.page.CrossDeviceMobileConnected;
import com.onfido.qa.websdk.page.CrossDeviceSubmit;
import com.onfido.qa.websdk.page.DocumentUpload;
import com.onfido.qa.websdk.page.IdDocumentSelector;
import com.onfido.qa.websdk.page.ImageQualityGuide;
import com.onfido.qa.websdk.page.MobileNotificationSent;
import com.onfido.qa.websdk.page.Welcome;
import com.onfido.qa.websdk.sdk.DocumentStep;
import com.onfido.qa.websdk.sdk.FaceStep;
import com.onfido.qa.websdk.sdk.Raw;
import com.onfido.qa.websdk.sdk.WebSdk;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.annotations.Test;

import static com.onfido.qa.websdk.DocumentType.PASSPORT;
import static com.onfido.qa.websdk.model.CrossDeviceLinkMethod.COPY_LINK;
import static com.onfido.qa.websdk.model.CrossDeviceLinkMethod.QR_CODE;
import static com.onfido.qa.websdk.model.CrossDeviceLinkMethod.SMS;
import static org.assertj.core.api.Assertions.assertThat;

public class CrossDeviceIT extends WebSdkIT {

    public static final String PRODUCT_NAME = "for a [COMPANY/PRODUCT NAME] loan";
    public static final String LOGO_URL = "https://assets.onfido.com/web-sdk-releases/6.16.0/images/sample-logo_2hXI-.svg";

    public CrossDeviceIT() {
    }

    public CrossDeviceIT(String language) {
        super(language);
    }

    @Test(description = "should verify UI elements on the cross device intro screen", groups = {"percy"})
    public void testShouldVerifyUiElementsOnTheCrossDeviceIntroScreen() {
        gotoCrossDeviceScreen();

        takePercySnapshot("CrossDeviceIntro");
    }

    @Test(description = "should navigate to cross device when forceCrossDevice is enabled")
    public void testShouldNavigateToCrossDeviceWhenForceCrossDeviceIsEnabled() {
        onfido().withSteps(new DocumentStep().withForceCrossDevice(true)).init(IdDocumentSelector.class)
                .select(PASSPORT, CrossDeviceIntro.class);
    }

    @Test(description = "should display cross device intro screen if forceCrossDevice is enabled with useLiveDocumentCapture enabled also")
    public void testShouldDisplayCrossDeviceIntroScreenIfForceCrossDeviceIsEnabledWithUseLiveDocumentCaptureEnabledAlso() {
        onfido().withSteps(new DocumentStep().withUseLiveDocumentCapture(true).withForceCrossDevice(true)).init(IdDocumentSelector.class)
                .select(PASSPORT, CrossDeviceIntro.class);
    }

    private CrossDeviceLink gotoCrossDeviceScreen() {
        return gotoCrossDeviceScreen(onfido());
    }

    private CrossDeviceLink gotoCrossDeviceScreen(WebSdk webSdk) {
        return webSdk
                .withSteps(new DocumentStep())
                .init(IdDocumentSelector.class)
                .select(PASSPORT, DocumentUpload.class)
                .switchToCrossDevice()
                .getSecureLink();
    }

    @Test(description = "should verify UI elements on the cross device link screen default QR code view", groups = {"percy"})
    public void testShouldVerifyUiElementsOnTheCrossDeviceLinkScreenDefaultQrCodeView() {
        var crossDeviceLink = gotoCrossDeviceScreen();

        assertThat(crossDeviceLink.isQrCodeIsDisplayed()).isTrue();

        crossDeviceLink.clickQrCodeHelp();

        assertThat(crossDeviceLink.isQrHelpListDisplayed()).isTrue();

        takePercySnapshot("CrossDeviceIntro-QR");
    }

    @Test(description = "should verify UI elements on the cross device link screen SMS view")
    public void testShouldVerifyUiElementsOnTheCrossDeviceLinkScreenSmsView() {

        var crossDeviceLink = gotoCrossDeviceScreen();
        crossDeviceLink.clickSmsOption();

        takePercySnapshot("CrossDeviceIntro-Sms");
    }

    @Test(description = "should change the state of the copy to clipboard button after clicking")
    public void testShouldVerifyUiElementsOnTheCrossDeviceLinkScreenCopyLinkView() {
        var crossDeviceLink = gotoCrossDeviceScreen().clickLinkOption();

        verifyCopy(crossDeviceLink.copyLinkText(), "get_link.button_copy");

        takePercySnapshot("CrossDeviceIntro-Link");
        crossDeviceLink.clickCopyLink();

        verifyCopy(crossDeviceLink.copyLinkText(), "get_link.button_copied");
    }

    @Test(description = "should display copy link view by default when excludeSmsCrossDeviceOption is enabled")
    public void testShouldDisplayCopyLinkViewByDefaultWhenExcludeSmsCrossDeviceOptionIsEnabled() {

        var crossDeviceLink = gotoCrossDeviceScreen(onfido().withCrossDeviceLinkMethods(COPY_LINK, QR_CODE));

        assertThat(crossDeviceLink.isOptionAvailable(QR_CODE)).isTrue();
        assertThat(crossDeviceLink.isOptionAvailable(SMS)).isFalse();

    }

    @Test(description = "should display SMS link view only and no alternative options are enabled")
    public void testShouldDisplaySmsLinkViewOnlyAndNoAlternativeOptionsAreEnabled() {

        var crossDeviceLink = gotoCrossDeviceScreen(onfido().withCrossDeviceLinkMethods(SMS));

        assertThat(crossDeviceLink.alternativeMethodOptionsSectionIsDisplayed()).isFalse();

    }

    @Test(description = "should display default cross device QR code link view when given invalid alternative methods")
    public void testShouldDisplayDefaultCrossDeviceQrCodeLinkViewWhenGivenInvalidAlternativeMethods() {

        var crossDeviceLink = gotoCrossDeviceScreen(onfido().withCrossDeviceLinkMethods("copy", "qrCode", "sms"));

        assertThat(crossDeviceLink.isQrCodeIsDisplayed()).isTrue();
        assertThat(crossDeviceLink.alternativeMethodOptionsSectionIsDisplayed()).isTrue();

        assertThat(crossDeviceLink.isOptionAvailable(SMS)).isTrue();
        assertThat(crossDeviceLink.isOptionAvailable(COPY_LINK)).isTrue();
    }

    @Test(description = "should display error when mobile number is not provided")
    public void testShouldDisplayErrorWhenMobileNumberIsNotProvided() {
        var crossDeviceLink = gotoCrossDeviceScreen();
        crossDeviceLink.clickSmsOption();
        crossDeviceLink.typeSmsNumber("");
        crossDeviceLink.clickSendSms();

        assertThat(crossDeviceLink.isPhoneNumberErrorShown()).isTrue();
    }

    @Test(description = "should display error when mobile number is wrong")
    public void testShouldDisplayErrorWhenMobileNumberIsWrong() {

        var crossDeviceLink = gotoCrossDeviceScreen()
                .clickSmsOption()
                .typeSmsNumber("123456789")
                .clickSendSms();

        assertThat(crossDeviceLink.isPhoneNumberErrorShown()).isTrue();

    }

    @Test(description = "should display error when mobile number is possible but not a valid mobile number")
    public void testShouldDisplayErrorWhenMobileNumberIsPossibleButNotAValidMobileNumber() {
        var crossDeviceLink = gotoCrossDeviceScreen()
                .clickSmsOption()
                .selectCountry("HK")
                .typeSmsNumber("99999999")
                .clickSendSms();

        assertThat(crossDeviceLink.isPhoneNumberErrorShown()).isTrue();
    }

    @Test(description = "should send sms and navigate to \"Check your mobile\" screen ")
    public void testShouldSendSmsAndNavigateToCheckYourMobileScreen() {

        gotoCrossDeviceScreen()
                .clickSmsOption()
                .typeSmsNumber(properties().getProperty("testDevicePhoneNumber"))
                .clickSendSms();

        driver().waitFor(ExpectedConditions.alertIsPresent());
        driver().switchTo().alert().accept();

        verifyPage(MobileNotificationSent.class);
    }

    @Test(description = "should be able to resend sms")
    public void testShouldBeAbleToResendSms() {

        gotoCrossDeviceScreen()
                .clickSmsOption()
                .typeSmsNumber(properties().getProperty("testDevicePhoneNumber"))
                .clickSendSms();

        driver().waitFor(ExpectedConditions.alertIsPresent());
        driver().switchTo().alert().accept();

        verifyPage(MobileNotificationSent.class)
                .clickResentLink()
                .clickSmsOption()
                .clickSendSms();

        driver().waitFor(ExpectedConditions.alertIsPresent());
        driver().switchTo().alert().accept();

        verifyPage(MobileNotificationSent.class);
    }

    @Test(description = "should verify UI elements on cross device mobile client intro screen", groups = {"percy"})
    public void testShouldVerifyUiElementsOnCrossDeviceMobileClientIntroScreen() {

        var link = gotoCrossDeviceScreen(onfido().withSteps(new FaceStep().withUseUploader(true))).copyLink();

        openMobileScreen(link);

        switchToMainScreen();
        verifyPage(CrossDeviceMobileConnected.class);

        takePercySnapshot("CrossDeviceMobileConnected");

        switchToMobileScreen();
        verifyPage(CrossDeviceClientIntro.class).clickContinue(DocumentUpload.class)
                                                .clickUploadButton(ImageQualityGuide.class)
                                                .upload(UploadDocument.FACE).clickConfirmButton(null);

        switchToMainScreen();
        takePercySnapshot("CrossDeviceSubmit");
    }

    @Test(description = "should verify all custom UI elements on customised cross device mobile client intro screen", groups = {"percy"})
    public void testShouldVerifyAllCustomUiElementsOnCustomisedCrossDeviceMobileClientIntroScreen() {

        // TODO: check with Stefania what is the expected behavior here. I miss the CrossDeviceClientIntro. Bug?

        var link = onfido().withSteps("welcome", new FaceStep().withUseUploader(true))
                           .withCrossDeviceClientIntroProductName(PRODUCT_NAME)
                           .withCrossDeviceClientIntroProductLogoSrc(LOGO_URL)
                           .init(Welcome.class).continueToNextStep(DocumentUpload.class)
                           .switchToCrossDevice()
                           .getSecureLink()
                           .copyLink();

        openMobileScreen(link);

        switchToMainScreen();
        verifyPage(CrossDeviceMobileConnected.class);

        takePercySnapshot("CrossDeviceMobileConnected");

        switchToMobileScreen();
        var crossDeviceClientIntro = verifyPage(CrossDeviceClientIntro.class);

        assertThat(crossDeviceClientIntro.subTitle()).contains(PRODUCT_NAME);
        assertThat(crossDeviceClientIntro.isCustomIconDisplayed()).isTrue();

        takePercySnapshot("CrossDeviceClientIntro-customProductName");

    }

    @Test(description = "should successfully complete cross device e2e flow with selfie upload")
    public void testShouldSuccessfullyCompleteCrossDeviceE2EFlowWithSelfieUpload() {

        var link = onfido().withSteps(new FaceStep().withUseUploader(true))
                           .withOnComplete(new Raw("() => window.onCompleteTriggered = true"))
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
        var crossDeviceSubmit = verifyPage(CrossDeviceSubmit.class);
        crossDeviceSubmit.submitVerification();

        assertThat((Boolean) driver().executeScript("return window.onCompleteTriggered")).isTrue();

        assertThat(crossDeviceSubmit.submitVerificationEnabled()).isFalse();
    }
}
