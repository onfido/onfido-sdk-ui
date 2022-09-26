package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.websdk.PoADocumentType;
import com.onfido.qa.websdk.model.DocumentOption;
import org.openqa.selenium.By;

import java.util.List;
import java.util.stream.Collectors;

public class PoADocumentSelection extends DocumentSelectorBase {
    public PoADocumentSelection(Driver driver) {
        super(driver);
    }

    public List<PoADocumentType> getOptions() {

        return driver.findElements(By.cssSelector(".onfido-sdk-ui-DocumentSelector-DocumentList-list > li > button"))
              .stream()
              .map(x -> {
                  return PoADocumentType.fromCanonicalName(x.getAttribute("data-onfido-qa"));
              })
              .collect(Collectors.toList());

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
