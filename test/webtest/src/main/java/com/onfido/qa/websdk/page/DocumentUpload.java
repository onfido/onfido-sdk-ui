package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import com.onfido.qa.websdk.util.ByUtil;
import org.openqa.selenium.By;

public class DocumentUpload extends DocumentUploadBasePage {

    public static final By ICON = By.cssSelector(".onfido-sdk-ui-Uploader-icon");

    public DocumentUpload(Driver driver) {
        super(driver);
    }

    public <T extends Page> T clickUploadButton(Class<T> next) {
        click(ByUtil.onfidoQa("uploaderButtonLink"));
        return createComponent(next);
    }

    @Override
    protected By pageId() {
        return ICON;
    }

    public CrossDeviceIntro continueOnPhone() {
        click(By.cssSelector(".onfido-sdk-ui-Uploader-crossDeviceButton"));
        return new CrossDeviceIntro(driver);
    }

}
