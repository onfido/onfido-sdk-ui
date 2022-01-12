package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public class SelfieUpload extends DocumentUploadBasePage {
    public SelfieUpload(Driver driver) {
        super(driver);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("SelfieUpload");
    }
}
