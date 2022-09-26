package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public class DocumentLiveCapture extends BasePage {

    public DocumentLiveCapture(Driver driver) {
        super(driver);
    }

    public ConfirmUpload takePhoto() {
        click(By.cssSelector(".onfido-sdk-ui-Camera-btn"));

        return new ConfirmUpload(driver);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("DocumentLiveCapture");
    }
}
