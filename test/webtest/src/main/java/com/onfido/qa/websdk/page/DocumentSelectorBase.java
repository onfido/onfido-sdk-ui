package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import com.onfido.qa.websdk.IDocumentType;
import org.openqa.selenium.By;

public abstract class DocumentSelectorBase extends BasePage {
    protected DocumentSelectorBase(Driver driver) {
        super(driver);
    }

    protected <T extends Page> T select(IDocumentType documentType, Class<T> next) {

        click(By.cssSelector(String.format("button[data-onfido-qa='%s']", documentType.canonicalName())));

        return createComponent(next);
    }
}
