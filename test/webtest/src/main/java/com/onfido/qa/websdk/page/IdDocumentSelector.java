package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.webdriver.common.Page;
import com.onfido.qa.websdk.DocumentType;
import com.onfido.qa.websdk.model.DocumentOption;
import org.openqa.selenium.By;

public class IdDocumentSelector extends DocumentSelectorBase {

    public IdDocumentSelector(Driver driver) {
        super(driver);
    }

    public DocumentOption getOption(DocumentType documentType) {
        return _getOption(documentType);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("IdDocumentSelector");
    }

    public <T extends Page> T select(DocumentType documentType, Class<T> next) {
        return super.select(documentType, next);
    }

}
