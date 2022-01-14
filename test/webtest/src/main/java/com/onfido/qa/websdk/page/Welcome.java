package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import org.openqa.selenium.By;

public class Welcome extends BasePage {

    public static final By PRIMARY_BUTTON = By.cssSelector("[data-onfido-qa=\"welcome-next-btn\"]");

    public Welcome(Driver driver) {
        super(driver);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("Welcome");
    }

    public void continueToNextStep() {
        click(PRIMARY_BUTTON);
    }

    public <T extends Page> T continueToNextStep(Class<T> tClass) {
        continueToNextStep();
        return createComponent(tClass);
    }
}
