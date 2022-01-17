package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.websdk.IDocumentType;
import com.onfido.qa.websdk.PoADocumentType;
import com.onfido.qa.websdk.model.Option;
import org.openqa.selenium.By;

public class PoADocumentSelection extends DocumentSelectorBase {
    protected PoADocumentSelection(Driver driver) {
        super(driver);
    }


    public Option getOption(PoADocumentType documentType) {
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
