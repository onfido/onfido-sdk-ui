package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public class PassportUploaderIntro extends BasePage {
    public PassportUploaderIntro(Driver driver) {
        super(driver);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("PassportUploadIntro");
    }

    public ImageQualityGuide takePhoto() {
        click(By.cssSelector(".onfido-sdk-ui-Uploader-buttons button"));
        return new ImageQualityGuide(driver);
    }

}
