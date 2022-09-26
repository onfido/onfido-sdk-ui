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
import org.openqa.selenium.support.pagefactory.ByChained;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

public class RestrictedDocumentSelection extends BasePage {
    protected static final String SUPPORTED_COUNTRY = "france";

    private static final Logger log = LoggerFactory.getLogger(RestrictedDocumentSelection.class);

    public static final By BASE = By.cssSelector("[data-onfido-qa=\"countrySelector\"]");
    public static final By SEARCH = By.cssSelector("[data-onfido-qa='countrySelector'] #country-search");
    public static final By ERROR_MESSAGE = By.cssSelector(".onfido-sdk-ui-CountrySelector-fallbackText");
    public static final int QUARTER_SECOND = 250;

    public List<String> getCountries() {

        click(countryFinderInput());

        return driver.findElements(new ByChained(BASE, By.cssSelector("ul li span")))
                .stream()
                .map(WebElement::getText)
                .collect(Collectors.toList());

    }

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
        sleep(QUARTER_SECOND);
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

    public Boolean optionExists(DocumentType documentType) {
        return !driver.findElements(ByUtil.onfidoQa(documentType.canonicalName())).isEmpty();
    }

    public List<DocumentType> getOptions() {

        return driver.findElements(By.cssSelector(".onfido-sdk-ui-DocumentSelector-DocumentList-list li button"))
                .stream()
                .map(x -> {
                     return DocumentType.fromCanonicalName(x.getAttribute("data-onfido-qa"));
                })
                .collect(Collectors.toList());
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
