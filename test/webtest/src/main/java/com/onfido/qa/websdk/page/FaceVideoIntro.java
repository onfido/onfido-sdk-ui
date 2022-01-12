package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.websdk.util.ByUtil;
import org.openqa.selenium.By;

public class FaceVideoIntro extends BasePage {

    public FaceVideoIntro(Driver driver) {
        super(driver);
    }

    public Permission recordVideo() {
        click(ByUtil.onfidoQa("liveness-continue-btn"));

        return new Permission(driver);

    }

    @Override
    protected By pageId() {
        return pageIdSelector("FaceVideoIntro");
    }
}
