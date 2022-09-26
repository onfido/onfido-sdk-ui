package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public class Error extends BasePage {

    public Error(Driver driver) {
        super(driver);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("Error");
    }

    public String errorMessage() {
        return text(By.cssSelector("[data-qa='error']"));
    }
}
