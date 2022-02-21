package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import com.onfido.qa.websdk.util.ByUtil;
import org.openqa.selenium.By;

public class SelfieIntro extends BasePage {
    public SelfieIntro(Driver driver) {
        super(driver);
    }

    public <T extends Page> T clickContinue(Class<T> next) {
        click(ByUtil.onfidoQa("selfie-continue-btn"));
        return createComponent(next);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("SelfieIntro");
    }
}
