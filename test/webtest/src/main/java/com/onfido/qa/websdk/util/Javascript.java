package com.onfido.qa.websdk.util;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.WebElement;

public class Javascript {

    private final Driver driver;

    public Javascript(Driver driver) {
        this.driver = driver;
    }

    public Javascript changeDisplayStyle(WebElement element, String display) {
        executeScriptOnElement(String.format("arguments[0].style.display = '%s'", display), element);
        return this;
    }

    private void executeScriptOnElement(String script, WebElement element) {
        driver.executeScript(script, element);
    }

}
