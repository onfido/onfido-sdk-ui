package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import org.openqa.selenium.By;

public class Modal extends Page {
    public Modal(Driver driver) {
        super(driver);
    }

    public boolean isShown() {
        return driver.isInDom(By.cssSelector(".onfido-sdk-ui-Theme-portal > *"));
    }

    public Modal clickOnOverlay() {

        var overlay = driver.findElement(By.cssSelector(".onfido-sdk-ui-Theme-modalOverlay"));
        var size = overlay.getSize();

        driver.actions().moveByOffset(10, 10).click().perform();

        return this;
    }
}
