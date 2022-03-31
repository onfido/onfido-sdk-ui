package com.onfido.qa.websdk.test;

import com.onfido.qa.websdk.page.IdDocumentSelector;
import com.onfido.qa.websdk.page.UserConsent;
import org.openqa.selenium.By;
import org.testng.annotations.Ignore;
import org.testng.annotations.Test;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

public class UserConsentIT extends WebSdkIT {

    public static final String CONSENT_FRAME_TITLE = "Onfido's privacy statement and Terms of Service";

    private UserConsent init() {
        return onfido().withSdkConfiguration(Map.of("sdk_features", Map.of("enable_applicant_consents", true))).withSteps("document").init(UserConsent.class);
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
        var documentSelector = init().acceptUserConsent(IdDocumentSelector.class);

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
}
