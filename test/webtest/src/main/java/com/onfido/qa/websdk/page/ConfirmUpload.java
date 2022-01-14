package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import org.openqa.selenium.By;

public class ConfirmUpload extends BasePage {

    public static final int HALF_A_SECOND = 500;

    public static final By MESSAGE = By.cssSelector(".onfido-sdk-ui-Confirm-message");
    public static final By BTN = By.cssSelector("[data-onfido-qa=\"confirm-action-btn\"]");
    public static final By ERROR_TITLE = By.cssSelector(".onfido-sdk-ui-Error-title-text");

    public ConfirmUpload(Driver driver) {
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

    public String errorTitle() {
        return text(ERROR_TITLE);
    }

    public boolean isErrorShown() {
        return driver.isInDom(ERROR_TITLE);
    }

    public String message() {
        return text(MESSAGE);
    }

    public <T extends Page> T clickConfirmButton(Class<T> next) {
        click(BTN);

        sleep(HALF_A_SECOND);

        return createComponent(next);
    }
}
