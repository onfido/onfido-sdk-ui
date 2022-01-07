package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class CountrySelector extends BasePage {

    public static final By BASE = By.cssSelector("[data-onfido-qa=\"countrySelector\"]");

    public CountrySelector(Driver driver) {
        super(driver);
    }

    @Override
    protected By pageId() {
        // TODO: add pageId
        return BASE;
    }

    public WebElement submitDocumentBtn() {
        return driver.findElement(By.cssSelector("[data-onfido-qa=\"countrySelectorNextStep\"]"));
    }

    public WebElement countryFinderInput() {
        return driver.findElement(BASE, By.cssSelector("#country-search"));
    }

    public String selectorLabel() {
        return text(By.cssSelector(".onfido-sdk-ui-CountrySelector-label"));
    }
}
