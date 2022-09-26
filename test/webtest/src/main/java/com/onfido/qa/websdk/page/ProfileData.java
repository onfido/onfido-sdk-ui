package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public class ProfileData extends BasePage {
    public ProfileData(Driver driver) {
        super(driver);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("ProfileData");
    }
}
