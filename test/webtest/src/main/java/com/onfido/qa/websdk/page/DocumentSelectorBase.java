package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import com.onfido.qa.websdk.IDocumentType;
import com.onfido.qa.websdk.model.DocumentOption;
import com.onfido.qa.websdk.util.ByUtil;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public abstract class DocumentSelectorBase extends BasePage {
    protected DocumentSelectorBase(Driver driver) {
        super(driver);
    }

    protected DocumentOption _getOption(IDocumentType documentType) {

        var element = driver.findElement(ByUtil.onfidoQa(documentType.canonicalName()));

        var name = element.findElement(By.cssSelector(".onfido-sdk-ui-DocumentSelector-DocumentList-label")).getText();
        var eStatementAccepted = element.findElements(By.cssSelector(".onfido-sdk-ui-DocumentSelector-DocumentList-tag")).size() == 1;
        var hint = getOptionalText(element, By.cssSelector(".onfido-sdk-ui-DocumentSelector-DocumentList-hint"));
        var warning = getOptionalText(element, By.cssSelector(".onfido-sdk-ui-DocumentSelector-DocumentList-warning"));

        return new DocumentOption(name, hint, warning, eStatementAccepted);

    }

    protected <T extends Page> T select(IDocumentType documentType, Class<T> next) {

        click(By.cssSelector(String.format("button[data-onfido-qa='%s']", documentType.canonicalName())));

        return createComponent(next);
    }

    protected String getOptionalText(WebElement element, By by) {

        var elements = element.findElements(by);
        if (elements.isEmpty()) {
            return null;
        }

        return elements.get(0).getText();

    }
}
