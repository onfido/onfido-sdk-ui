package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class DocumentVideoConfirm extends BasePage {
    public DocumentVideoConfirm(Driver driver) {
        super(driver);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("DocumentVideoConfirm");
    }


    public String videoTitle() {
        return text(By.cssSelector(".onfido-sdk-ui-DocumentVideo-reusables-title"));
    }


    public WebElement confirmIcon() {
        return driver.findElement(By.cssSelector(".onfido-sdk-ui-DocumentVideo-Confirm-icon"));
    }

    public String confirmMessage() {
        return text(By.cssSelector(".onfido-sdk-ui-DocumentVideo-Confirm-body"));
    }

}
