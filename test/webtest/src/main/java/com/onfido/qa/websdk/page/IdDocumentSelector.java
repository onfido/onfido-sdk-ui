package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import com.onfido.qa.websdk.DocumentType;
import com.onfido.qa.websdk.model.DocumentOption;
import org.openqa.selenium.By;
import com.onfido.qa.websdk.util.ByUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

public class IdDocumentSelector extends DocumentSelectorBase {

    public static final String SUPPORTED_COUNTRY = "france";

    private static final Logger log = LoggerFactory.getLogger(CountrySelector.class);

    public static final By BASE = By.cssSelector("[data-onfido-qa=\"countrySelector\"]");
    public static final By SEARCH = By.cssSelector("[data-onfido-qa='countrySelector'] #country-search");
    public static final By SUBMIT_BUTTON = ByUtil.onfidoQa("countrySelectorNextStep");
    public static final By ERROR_MESSAGE = By.cssSelector(".onfido-sdk-ui-CountrySelector-fallbackText");


    public IdDocumentSelector(Driver driver) {
        super(driver);
    }



    public IdDocumentSelector selectSupportedCountry() {
        return selectCountry(SUPPORTED_COUNTRY);
    }

    public IdDocumentSelector selectCountry(String search) {
        searchFor(search);
        return selectFirstOptionInDropdownMenu();
    }


    public IdDocumentSelector searchFor(String search) {
        input(SEARCH, search);
        return this;
    }

    public IdDocumentSelector selectFirstOptionInDropdownMenu() {
        sleep(250);
        driver.actions().sendKeys(Keys.DOWN, Keys.ENTER).perform();

        return this;
    }



    public DocumentOption getOption(DocumentType documentType) {
        return _getOption(documentType);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("IdDocumentSelector");
    }

    public <T extends Page> T select(DocumentType documentType, Class<T> next) {
        return super.select(documentType, next);
    }

    public WebElement countryFinderInput() {
        return driver.findElement(BASE, By.cssSelector("#country-search"));
    }

    public String selectorLabel() {
        return text(By.cssSelector(".onfido-sdk-ui-CountrySelector-label"));
    }

}
