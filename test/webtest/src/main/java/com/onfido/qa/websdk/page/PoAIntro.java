package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public class PoAIntro extends BasePage {

    public static final By REQUIREMENTS_HEADER = By.cssSelector(".onfido-sdk-ui-ProofOfAddress-PoAIntro-requirements");
    public static final By START_VERIFICATION = By.cssSelector("[data-onfido-qa=\"poa-start-btn\"]");

    public PoAIntro(Driver driver) {
        super(driver);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("PoAIntro");
    }

    @Override
    protected void verifyPage(Driver driver) {
        super.verifyPage(driver);

        driver.waitFor.visibility(REQUIREMENTS_HEADER);
    }

    public String requirementsHeader() {
        return text(REQUIREMENTS_HEADER);
    }

    public String firstRequirement() {
        return text(By.cssSelector(".onfido-sdk-ui-ProofOfAddress-PoAIntro-requirement:nth-child(2) > span"));
    }

    public String secondRequirement() {
        return text(By.cssSelector(".onfido-sdk-ui-ProofOfAddress-PoAIntro-requirement:nth-child(3) > span"));
    }

    public String thirdRequirement() {
        return text(By.cssSelector(".onfido-sdk-ui-ProofOfAddress-PoAIntro-requirement:nth-child(4) > span"));
    }

    public String startVerificationButtonText() {
        return text(START_VERIFICATION);
    }

    public CountrySelector startVerification() {
        click(START_VERIFICATION);

        return new CountrySelector(driver);
    }
}
