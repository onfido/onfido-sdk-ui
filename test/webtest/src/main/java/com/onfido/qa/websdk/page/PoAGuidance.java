package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public class PoAGuidance extends BasePage {

    public static final By CONTINUE_BUTTON = By.cssSelector("[data-onfido-qa=\"poa-continue-btn\"]");

    public PoAGuidance(Driver driver) {
        super(driver);
    }

    public String makeSure() {
        return text(By.cssSelector(".onfido-sdk-ui-ProofOfAddress-Guidance-makeSure"));
    }

    public String logoText() {
        return text(By.cssSelector(".onfido-sdk-ui-ProofOfAddress-Guidance-requirement"));
    }

    public String continueButtonText() {
        return text(CONTINUE_BUTTON);
    }

    public DocumentUpload clickContinue() {
        click(CONTINUE_BUTTON);
        return new DocumentUpload(driver);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("PoAGuidance");
    }
}
