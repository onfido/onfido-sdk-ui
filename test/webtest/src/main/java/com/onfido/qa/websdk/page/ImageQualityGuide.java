package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public class ImageQualityGuide extends DocumentUploadBasePage {
    public ImageQualityGuide(Driver driver) {
        super(driver);
    }


    public String getErrorMessage() {
        return text(By.cssSelector(".onfido-sdk-ui-Uploader-error"));
    }

    @Override
    protected By pageId() {
        return pageIdSelector("ImageQualityGuide");
    }

}
