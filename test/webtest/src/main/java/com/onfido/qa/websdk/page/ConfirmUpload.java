package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public class ConfirmUpload extends BasePage {

    public static final By MESSAGE = By.cssSelector(".onfido-sdk-ui-Confirm-message");
    public static final By BTN = By.cssSelector("[data-onfido-qa=\"confirm-action-btn\"]");
    public static final int HALF_A_SECOND = 500;

    protected ConfirmUpload(Driver driver) {
        super(driver);
    }

    @Override
    protected By pageId() {
        // TODO: add pageId
        return null;
    }

    @Override
    protected void verifyPage(Driver driver) {
        super.verifyPage(driver);

        driver.waitFor.presence(BTN);

    }

    public String message() {
        return text(MESSAGE);
    }

    public <T> T clickConfirmButton(Class<T> next) {
        click(BTN);

        sleep(HALF_A_SECOND);

        return createComponent(next);
    }
}
