package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import com.onfido.qa.websdk.util.ByUtil;
import org.openqa.selenium.By;

public class CrossDeviceClientIntro extends BasePage {
    public CrossDeviceClientIntro(Driver driver) {
        super(driver);
    }

    public <T extends Page> T clickContinue(Class<T> next) {

        click(ByUtil.onfidoQa("client-session-linked-primary-btn"));
        return createComponent(next);
    }

    public boolean isCustomIconDisplayed() {
        return driver.findElement(By.cssSelector(".onfido-sdk-ui-crossDevice-ClientIntro-customIcon")).isDisplayed();
    }

    @Override
    protected By pageId() {
        return pageIdSelector("CrossDeviceClientIntro");
    }
}
