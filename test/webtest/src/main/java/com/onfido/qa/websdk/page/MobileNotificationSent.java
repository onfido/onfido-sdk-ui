package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public class MobileNotificationSent extends BasePage {
    public MobileNotificationSent(Driver driver) {
        super(driver);
    }

    public CrossDeviceLink clickResentLink() {
        click(By.cssSelector(".onfido-sdk-ui-crossDevice-MobileNotificationSent-cancel"));
        return new CrossDeviceLink(driver);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("MobileNotificationSent");
    }
}
