package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public class SpinnerPage extends BasePage {

    public SpinnerPage(Driver driver) {
        super(driver);
    }

    @Override
    protected By pageId() {
        return SPINNER;
    }

    @Override
    public void waitForLoaderDisappears(Driver driver) {
        // do not wait for loader to disappear, as the whole purpose of this page is to have the loader
    }
}
