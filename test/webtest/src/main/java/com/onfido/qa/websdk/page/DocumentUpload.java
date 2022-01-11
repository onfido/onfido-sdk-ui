package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public class DocumentUpload extends DocumentUploadBasePage {

    public static final By ICON = By.cssSelector(".onfido-sdk-ui-Uploader-icon");

    public DocumentUpload(Driver driver) {
        super(driver);
    }

    @Override
    protected By pageId() {
        // TODO: add page id
        return ICON;
    }

}
