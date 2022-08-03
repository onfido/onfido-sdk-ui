package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import com.onfido.qa.websdk.util.ByUtil;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class BasePage extends Page {

    private static final Logger log = LoggerFactory.getLogger(BasePage.class);

    protected static final By SPINNER = By.cssSelector(".onfido-sdk-ui-Spinner-loader");
    private static final By CLOSE_MODAL = By.cssSelector(".onfido-sdk-ui-Modal-closeButton");
    private static final By BACK_ARROW = By.cssSelector(".onfido-sdk-ui-NavigationBar-iconBack");

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

    public boolean isCobrandDisplayed() {
        return driver.findElement(By.cssSelector(".onfido-sdk-ui-Theme-cobrandFooter")).isDisplayed();
    }

    public boolean isCobrandLogoDisplayed() {
        return driver.findElement(By.cssSelector(".onfido-sdk-ui-Theme-logoCobrandImage")).isDisplayed();
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

    @Override
    protected WebElement input(By by, String value) {

        if (driver.driver.getCapabilities().getBrowserName().equalsIgnoreCase("internet explorer")) {
            var chars = value.split("");
            var input = driver.waitFor.clickable(by);
            input.clear();
            for (String c : chars) {
                input.sendKeys(c);
                sleep(50);
            }

            return input;
        } else {
            return super.input(by, value);
        }

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
        click(BACK_ARROW);
        return createComponent(next);
    }

    public WebElement backArrow() {
        return driver.findElement(BACK_ARROW);
    }

    protected By pageIdSelector(String pageId) {
        return ByUtil.pageId(pageId);
    }

}
