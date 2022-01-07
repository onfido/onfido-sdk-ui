package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.websdk.PoADocumentType;
import com.onfido.qa.websdk.util.ByUtil;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.Objects;

public class PoADocumentSelection extends DocumentSelectorBase {
    protected PoADocumentSelection(Driver driver) {
        super(driver);
    }

    public Option getOption(PoADocumentType documentType) {

        var element = driver.findElement(ByUtil.onfidoQa(documentType.canonicalName()));

        var name = element.findElement(By.cssSelector(".onfido-sdk-ui-DocumentSelector-label")).getText();
        var eStatementAccepted = element.findElements(By.cssSelector(".onfido-sdk-ui-DocumentSelector-tag")).size() == 1;
        var hint = getOptionalText(element, By.cssSelector(".onfido-sdk-ui-DocumentSelector-hint"));
        var warning = getOptionalText(element, By.cssSelector(".onfido-sdk-ui-DocumentSelector-warning"));

        return new Option(name, hint, warning, eStatementAccepted);

    }
    private String getOptionalText(WebElement element, By by) {

        var elements = element.findElements(by);
        if (elements.isEmpty()) {
            return null;
        }

        return elements.get(0).getText();

    }

    @Override
    protected By pageId() {
        return pageIdSelector("PoaDocumentSelector");
    }

    public PoAGuidance select(PoADocumentType documentType) {
        return select(documentType, PoAGuidance.class);
    }

    public static class Option {

        public final String name;
        public final String hint;
        public final String warning;
        public final boolean eStatementAccepted;

        public Option(String name, String hint, String warning, boolean eStatementAccepted) {
            this.name = name;
            this.hint = hint;
            this.warning = warning;
            this.eStatementAccepted = eStatementAccepted;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Option option = (Option) o;
            //noinspection OverlyComplexBooleanExpression
            return eStatementAccepted == option.eStatementAccepted && name.equals(option.name) && Objects.equals(hint, option.hint) && Objects.equals(warning, option.warning);
        }

        @Override
        public int hashCode() {
            return Objects.hash(name, hint, warning, eStatementAccepted);
        }
    }
}
