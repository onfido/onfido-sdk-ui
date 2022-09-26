package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import org.openqa.selenium.By;

public class HostedAppStep2 extends Page {
    public HostedAppStep2(Driver driver) {
        super(driver);
    }

    public Welcome startVerification() {
        click(By.cssSelector(".qa-start-verification-btn"));

        return new Welcome(driver);
    }

    @Override
    protected void verifyPage(Driver driver) {
        super.verifyPage(driver);

        driver.waitFor.visibility(By.cssSelector(".qa-second-step-text"));
    }
}
