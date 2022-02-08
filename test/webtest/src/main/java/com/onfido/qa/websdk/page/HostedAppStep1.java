package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import org.openqa.selenium.By;

public class HostedAppStep1 extends Page {
    public HostedAppStep1(Driver driver) {
        super(driver);
    }

    public HostedAppStep2 next() {
        click(By.cssSelector(".qa-step-two-btn"));
        return new HostedAppStep2(driver);
    }

    @Override
    protected void verifyPage(Driver driver) {
        super.verifyPage(driver);

        driver.waitFor.visibility(By.cssSelector(".qa-first-step-text"));
    }
}
