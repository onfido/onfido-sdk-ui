package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.websdk.PoADocumentType;
import com.onfido.qa.websdk.model.DocumentOption;
import org.openqa.selenium.By;

public class PoADocumentSelection extends DocumentSelectorBase {
    protected PoADocumentSelection(Driver driver) {
        super(driver);
    }


    public DocumentOption getOption(PoADocumentType documentType) {
        return _getOption(documentType);
    }

    @Override
    protected By pageId() {
        return pageIdSelector("PoaDocumentSelector");
    }

    public PoAGuidance select(PoADocumentType documentType) {
        return select(documentType, PoAGuidance.class);
    }

}
