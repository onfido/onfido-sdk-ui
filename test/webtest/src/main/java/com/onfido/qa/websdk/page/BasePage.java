package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class BasePage extends Page {

    private static final Logger log = LoggerFactory.getLogger(BasePage.class);

    private static final By SPINNER = By.cssSelector(".onfido-sdk-ui-Spinner-loader");
    private static final By CLOSE_MODAL = By.cssSelector(".onfido-sdk-ui-Modal-closeButton");

    protected BasePage(Driver driver) {
        super(driver);
    }

    public boolean hasCloseModalButton() {
        return driver.isInDom(CLOSE_MODAL);
    }

    public void clickCloseModal() {
        click(CLOSE_MODAL);
    }

    public boolean isLogoVisible() {
        return !driver.isInDom(By.cssSelector(".onfido-sdk-ui-Theme-noLogo"));
    }

    protected abstract By pageId();

    @Override
    protected void verifyPage(Driver driver) {
        waitForLoaderDisappears(driver);

        var pageId = pageId();
        if (pageId != null) {
            driver.waitFor.visibility(pageId);
        }

        super.verifyPage(driver);
    }

    public void waitForLoaderDisappears(Driver driver) {
        driver.waitFor.invisible(SPINNER);
    }

    public void waitForLoaderToShow() {
        try {
            driver.waitFor(1).visibility(SPINNER);
        } catch (TimeoutException e) {
            log.warn("Loader didn't show up", e);
        }
    }

    public String title() {
        return text(By.cssSelector(".onfido-sdk-ui-PageTitle-titleSpan"));
    }

    public String subTitle() {
        return text(By.cssSelector(".onfido-sdk-ui-PageTitle-subTitle"));
    }

    public <T extends Page> T back(Class<T> next) {
        click(By.cssSelector(".onfido-sdk-ui-NavigationBar-iconBack"));
        return createComponent(next);
    }

    protected By pageIdSelector(String pageId) {
        return By.cssSelector("[data-page-id='" + pageId + "']");
    }
}
