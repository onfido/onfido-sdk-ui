package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public abstract class Camera extends BasePage {
    protected static final int ONE_SECOND = 1000;

    protected Camera(Driver driver) {
        super(driver);
    }

    public boolean onfidoFooterIsVisible() {
        return driver.isInDom(By.cssSelector(".onfido-sdk-ui-Theme-footer"));
    }


}
