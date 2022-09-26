package com.onfido.qa.websdk.util;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.WebElement;

public class Javascript {

    private final Driver driver;

    public Javascript(Driver driver) {
        this.driver = driver;
    }

    public Javascript makeElementVisible(WebElement element, String display) {

        executeScriptOnElement(String.format("arguments[0].style.setProperty('display', '%s', 'important')", display), element);
        executeScriptOnElement("arguments[0].style.setProperty('width', '1px', 'important')", element);
        executeScriptOnElement("arguments[0].style.setProperty('height', '1px', 'important')", element);

        return this;
    }

    private void executeScriptOnElement(String script, WebElement element) {
        driver.executeScript(script, element);
    }

}
