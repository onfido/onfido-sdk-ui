package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public class Complete extends BasePage {
    public Complete(Driver driver) {
        super(driver);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("Complete");
    }
}
