package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Component;
import com.onfido.qa.webdriver.common.Page;
import org.openqa.selenium.By;

public class UserConsent extends BasePage {

    public static final By ACCEPT = By.cssSelector("[data-onfido-qa=\"userConsentBtnPrimary\"]");
    public static final By DECLINE = By.cssSelector("[data-onfido-qa=\"userConsentBtnSecondary\"]");
    public static final By TITLE = By.cssSelector("[data-onfido-qa=\"userConsentFrameWrapper\"]> h1");

    public UserConsent(Driver driver) {
        super(driver);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("UserConsent");
    }

    @Override
    protected void verifyPage(Driver driver) {
        super.verifyPage(driver);

        driver.waitFor.visibility(TITLE);
    }

    public boolean isModalOpen() {
        return driver.isInDom(UserConsentModal.MODAL_TITLE);
    }

    public String consentFrameTitle() {
        return text(TITLE);
    }

    public String acceptButtonText() {
        return text(ACCEPT);
    }

    public String declineButtonText() {
        return text(DECLINE);
    }

    public <T extends Page> T acceptUserConsent(Class<T> next) {
        click(ACCEPT);
        return createComponent(next);
    }

    public UserConsentModal declineUserConsent() {
        click(DECLINE);

        return new UserConsentModal(driver);
    }

    public static class UserConsentModal extends Component {

        public static final By MODAL_TITLE = By.cssSelector("[data-onfido-qa=\"userConsentDeclineModalContent\"]> h2");
        public static final By PRIMARY = By.cssSelector("[data-onfido-qa=\"userConsentDeclineModalBtnPrimary\"]");
        public static final By SECONDARY = By.cssSelector("[data-onfido-qa=\"userConsentDeclineModalBtnSecondary\"]");

        protected UserConsentModal(Driver driver) {
            super(driver);

            driver.waitFor.visibility(MODAL_TITLE);
        }

        public String getTitle() {
            return text(MODAL_TITLE);
        }

        public String getPrimaryButtonText() {
            return text(PRIMARY);
        }

        public String getSecondaryButtonText() {
            return text(SECONDARY);
        }

        public UserConsent clickPrimaryButton() {
            click(PRIMARY);

            driver.waitFor.invisible(MODAL_TITLE);

            return new UserConsent(driver);
        }

        public void clickSecondaryButton() {
            click(SECONDARY);
        }
    }
}
