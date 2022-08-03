package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public class Retry extends BasePage {


    public Retry(Driver driver) {
        super(driver);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("Retry");
    }
}
