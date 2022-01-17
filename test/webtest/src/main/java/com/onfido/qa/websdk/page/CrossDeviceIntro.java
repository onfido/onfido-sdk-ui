package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public class CrossDeviceIntro extends BasePage {
    public CrossDeviceIntro(Driver driver) {
        super(driver);
    }

    public CrossDeviceLink getSecureLink() {
        click(By.cssSelector("[data-onfido-qa=\"cross-device-continue-btn\"]"));

        return new CrossDeviceLink(driver);
    }


    @Override
    protected By pageId() {
        return pageIdSelector("CrossDeviceIntro");
    }
}
