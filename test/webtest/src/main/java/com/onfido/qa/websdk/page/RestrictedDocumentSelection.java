package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import com.onfido.qa.websdk.DocumentType;
import com.onfido.qa.websdk.IDocumentType;
import com.onfido.qa.websdk.model.DocumentOption;
import com.onfido.qa.websdk.util.ByUtil;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RestrictedDocumentSelection extends BasePage {
    public static final String SUPPORTED_COUNTRY = "france";

    private static final Logger log = LoggerFactory.getLogger(CountrySelector.class);

    public static final By BASE = By.cssSelector("[data-onfido-qa=\"countrySelector\"]");
    public static final By SEARCH = By.cssSelector("[data-onfido-qa='countrySelector'] #country-search");
    public static final By SUBMIT_BUTTON = ByUtil.onfidoQa("countrySelectorNextStep");
    public static final By ERROR_MESSAGE = By.cssSelector(".onfido-sdk-ui-CountrySelector-fallbackText");

    protected DocumentOption _getOption(IDocumentType documentType) {

        var element = driver.findElement(ByUtil.onfidoQa(documentType.canonicalName()));
        var name = element.findElement(By.cssSelector(".onfido-sdk-ui-DocumentSelector-DocumentList-label")).getText();
        var eStatementAccepted = element.findElements(By.cssSelector(".onfido-sdk-ui-DocumentSelector-DocumentList-tag")).size() == 1;
        var hint = getOptionalText(element, By.cssSelector(".onfido-sdk-ui-DocumentSelector-DocumentList-hint"));
        var warning = getOptionalText(element, By.cssSelector(".onfido-sdk-ui-DocumentSelector-DocumentList-warning"));

        return new DocumentOption(name, hint, warning, eStatementAccepted);

    }

    protected String getOptionalText(WebElement element, By by) {

        var elements = element.findElements(by);
        if (elements.isEmpty()) {
            return null;
        }

        return elements.get(0).getText();

    }

    public RestrictedDocumentSelection(Driver driver) {
        super(driver);
    }

    public RestrictedDocumentSelection selectSupportedCountry() {
        return selectCountry(SUPPORTED_COUNTRY);
    }

    public RestrictedDocumentSelection selectCountry(String search) {
        searchFor(search);
        return selectFirstOptionInDropdownMenu();
    }

    public RestrictedDocumentSelection searchFor(String search) {
        input(SEARCH, search);
        return this;
    }

    public RestrictedDocumentSelection selectFirstOptionInDropdownMenu() {
        sleep(250);
        driver.actions().sendKeys(Keys.DOWN, Keys.ENTER).perform();

        return this;
    }

   

    public boolean countryNotFoundMessageIdDisabled() {

        try {
            driver.waitFor(1).visibility(ERROR_MESSAGE);
        } catch (Exception e) {
            log.error("Waiting for error message", e);
        }

        return driver.isInDom(ERROR_MESSAGE) && driver.findElement(ERROR_MESSAGE).isDisplayed();
    }


    public <T extends Page> T selectDocument(IDocumentType documentType, Class<T> next) {

        click(By.cssSelector(String.format("button[data-onfido-qa='%s']", documentType.canonicalName())));

        return createComponent(next);
    }

    public DocumentOption getOption(DocumentType documentType) {
        return _getOption(documentType);
    }

    @Override
    protected By pageId() {
        return BASE;
    }

    public WebElement countryFinderInput() {
        return driver.findElement(BASE, By.cssSelector("#country-search"));
    }

    public String selectorLabel() {
        return text(By.tagName("label"));
    }
    
}
