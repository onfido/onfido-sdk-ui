package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import org.openqa.selenium.By;

public class Permission extends BasePage {
    public Permission(Driver driver) {
        super(driver);
    }

    public <T extends Page> T clickEnableCamera(Class<T> next) {
        click(By.cssSelector("[data-onfido-qa='enable-camera-btn']"));
        return createComponent(next);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("Permission");
    }
}
