package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.websdk.util.ByUtil;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class DocumentVideoConfirm extends BasePage {

    public static final By SECONDARY_BUTTON = ByUtil.onfidoQa("doc-video-confirm-secondary-btn");

    public DocumentVideoConfirm(Driver driver) {
        super(driver);
    }

    public DocumentVideoConfirm previewVideo() {
        click(SECONDARY_BUTTON);
        return this;
    }

    public DocumentVideoCapture retakeVideo() {
        click(SECONDARY_BUTTON);
        return new DocumentVideoCapture(driver);
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
