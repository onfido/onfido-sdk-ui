package com.onfido.qa.websdk.test;

import com.onfido.qa.webdriver.common.Page;
import com.onfido.qa.websdk.mock.Code;
import com.onfido.qa.websdk.mock.Consent;
import com.onfido.qa.websdk.mock.SdkConfiguration;
import com.onfido.qa.websdk.page.CrossDeviceClientIntro;
import com.onfido.qa.websdk.page.CrossDeviceMobileConnected;
import com.onfido.qa.websdk.page.DocumentUpload;
import com.onfido.qa.websdk.page.RestrictedDocumentSelection;
import com.onfido.qa.websdk.page.UserConsent;
import com.onfido.qa.websdk.page.Welcome;
import org.openqa.selenium.By;
import org.testng.annotations.Test;

import java.util.Arrays;

import static com.onfido.qa.websdk.DocumentType.PASSPORT;
import static org.assertj.core.api.Assertions.assertThat;

public class UserConsentIT extends WebSdkIT {

    public static final String CONSENT_FRAME_TITLE = "Onfido's privacy statement and Terms of Service";

    public <T extends Page> T init(Class<T> pageClass, Object... steps) {

        return onfido()
                .withSteps(steps)
                .withMock(mock -> {
                    mock.extend(Code.SDK_CONFIGURATION, new SdkConfiguration().withEnableRequireApplicantConsents(true));
                })
                .init(pageClass);
    }

    private UserConsent init() {
        return init(UserConsent.class, "document");
    }

    @Test(description = "should verify UI elements on the consent screen")
    public void testUIElementsOnTheScreen() {
        var consent = init();

        assertThat(consent.consentFrameTitle()).isEqualTo(CONSENT_FRAME_TITLE);

        verifyCopy(consent.acceptButtonText(), "user_consent.button_primary");
        verifyCopy(consent.declineButtonText(), "user_consent.button_secondary");
    }


    @Test(description = "should accept user consent")
    public void testAcceptUserConsent() {
        var documentSelector = init().acceptUserConsent(RestrictedDocumentSelection.class);

        verifyCopy(documentSelector.title(), "doc_select.title");
    }

    @Test(description = "'when clicking on decline it should show a modal'")
    public void testDeclineUserConsent() {

        var modal = init().declineUserConsent();

        verifyCopy(modal.getTitle(), "user_consent.prompt.no_consent_title");
        verifyCopy(modal.getPrimaryButtonText(), "user_consent.prompt.button_primary");
        verifyCopy(modal.getSecondaryButtonText(), "user_consent.prompt.button_secondary");
    }

    @Test(description = "when clicking on the modal primary button the modal should be dismissed")
    public void testDismissDeclineModal() {

        var modal = init().declineUserConsent();
        var userConsent = modal.clickPrimaryButton();

        assertThat(userConsent.isModalOpen()).isFalse();
    }

    @Test(description = "when clicking on the secondary button the sdk should be unmounted")
    public void testSecondaryClickOnDeclineModalUnmountsSdK() {
        init().declineUserConsent().clickSecondaryButton();
        assertThat(driver().findElements(By.id("#root > *"))).isEmpty();
    }

    @Test(description = "remove consents from navigation once accepted")
    public void testRemoveConsentsFromNavigationOnceAccepted() {
        var documentSelector = init().acceptUserConsent(RestrictedDocumentSelection.class);

        verifyCopy(documentSelector.title(), "doc_select.title");
        assertThat(documentSelector.backArrow().isDisplayed()).isFalse();
    }

    @Test(description = "remove consents from history once accepted")
    public void testRemoveConsentsFromHistoryOnceAccepted() {
        var crossDevice = init(Welcome.class, "welcome", "document")
                .continueToNextStep(UserConsent.class)
                .acceptUserConsent(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, DocumentUpload.class)
                .switchToCrossDevice();

        assertThat(crossDevice.backArrow().isDisplayed()).isTrue();

        var welcome = crossDevice
                .back(DocumentUpload.class)
                .back(RestrictedDocumentSelection.class)
                .back(Welcome.class);

        verifyCopy(welcome.title(), "welcome.title");
    }

    @Test(description = "do not show consent screen, if consent is already given")
    public void testConsentScreenNotShownWhenConsentAlreadyGiven() {
        var document = onfido()
                .withSteps("document")
                .withMock(mock -> {
                    mock.extend(Code.SDK_CONFIGURATION, new SdkConfiguration().withEnableRequireApplicantConsents(true));
                    mock.set(Code.CONSENTS, Arrays.asList(new Consent("privacy_notices_read_consent_given").withGranted(true)));
                })
                .init(RestrictedDocumentSelection.class);

        verifyCopy(document.title(), "doc_select.title");
    }

    @Test(description = "do not show consent screen, if consent is already given and not first screen")
    public void testConsentScreenNotShownWhenConsentAlreadyGivenAndNotFirstScreen() {
        var document = onfido()
                .withSteps("welcome","document")
                .withMock(mock -> {
                    mock.extend(Code.SDK_CONFIGURATION, new SdkConfiguration().withEnableRequireApplicantConsents(true));
                    mock.set(Code.CONSENTS, Arrays.asList(new Consent("privacy_notices_read_consent_given").withGranted(true)));
                })
                .init(Welcome.class)
                .continueToNextStep(RestrictedDocumentSelection.class);

        verifyCopy(document.title(), "doc_select.title");
    }

    @Test(description = "Is not displayed on cross device", groups = {"percy", "tabs"})
    public void testIsNotDisplayedOnCrossDevice() {
        var link = init(Welcome.class, "welcome", "document")
                .continueToNextStep(UserConsent.class)
                .acceptUserConsent(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, DocumentUpload.class)
                .switchToCrossDevice().getSecureLink().copyLink();

        openMobileScreen(link);

        var intro = verifyPage(CrossDeviceClientIntro.class);
        switchToMainScreen();

        verifyPage(CrossDeviceMobileConnected.class);
        switchToMobileScreen();

        var documentUpload = intro.clickContinue(DocumentUpload.class);

        verifyCopy(documentUpload.title(), "doc_submit.title_passport");
    }
}
