package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import com.onfido.qa.websdk.util.ByUtil;
import org.openqa.selenium.By;

public class FaceVideoIntro extends BasePage {

    public FaceVideoIntro(Driver driver) {
        super(driver);
    }

    public Permission recordVideo() {
        return recordVideo(Permission.class);
    }

    public <T extends Page> T recordVideo(Class<T> next) {
        click(ByUtil.onfidoQa("liveness-continue-btn"));

        return createComponent(next);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("FaceVideoIntro");
    }
}
