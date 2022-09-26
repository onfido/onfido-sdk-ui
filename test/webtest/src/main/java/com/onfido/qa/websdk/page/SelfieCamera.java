package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import org.openqa.selenium.By;

public class SelfieCamera extends Camera {

    public SelfieCamera(Driver driver) {
        super(driver);
    }


    public ConfirmUpload record() {
        sleep(ONE_SECOND);

        click(By.cssSelector(".onfido-sdk-ui-Camera-btn"));

        return new ConfirmUpload(driver);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("SelfieCapture");
    }
}
