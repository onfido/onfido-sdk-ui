package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import com.onfido.qa.websdk.util.ByUtil;
import org.openqa.selenium.By;

public class CrossDeviceSubmit extends BasePage {

    public static final By SUBMIT = ByUtil.onfidoQa("cross-device-submit-btn");

    public CrossDeviceSubmit(Driver driver) {
        super(driver);
    }

    public boolean submitVerificationEnabled() {
        return driver.findElement(SUBMIT).isEnabled();
    }

    @Override
    protected By pageId() {
        return pageIdSelector("CrossDeviceSubmit");
    }

    public void submitVerification() {
        click(SUBMIT);
    }

    public <T extends Page> T submitVerification(Class<T> next) {
        click(SUBMIT);
        return createComponent(next);
    }
}
