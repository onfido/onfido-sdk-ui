package com.onfido.qa.websdk.test;

import com.onfido.qa.websdk.PoADocumentType;
import com.onfido.qa.websdk.page.Complete;
import com.onfido.qa.websdk.page.PoADocumentSelection;
import com.onfido.qa.websdk.page.PoAIntro;
import com.onfido.qa.websdk.page.Welcome;
import org.testng.SkipException;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.Arrays;

public class PercyIT extends WebSdkIT {

    @DataProvider(name = "poaDocumentTypes")
    public static Object[][] poaDocumentTypes() {

        return Arrays.stream(PoADocumentType.values()).map(x -> {
            return new Object[]{x};
        }).toArray(Object[][]::new);
    }

    @Test(groups = {"percy"})
    public void welcome() {
        var welcome = onfido().withSteps("welcome", "complete").init(Welcome.class);
        takePercySnapshot("Welcome");

        welcome.continueToNextStep(Complete.class);
        takePercySnapshot("Complete");

    }

    @Test(groups = {"percy"})
    public void poa() {
        var intro = onfido().withSteps("poa").init(PoAIntro.class);
        takePercySnapshot("PoAIntro");

        var countrySelect = intro.startVerification();
        takePercySnapshot("PoACountrySelect");

        countrySelect.select("United", PoADocumentSelection.class);
        takePercySnapshot("PoADocumentSelection");
    }

    @Test(dataProvider = "poaDocumentTypes", groups = {"percy"})
    public void poaGuidance(PoADocumentType documentType) {

        // TODO: initialize with correct country
        if (!documentType.availableInCountry("GBR")) {
            throw new SkipException(String.format("Cannot execute test, as the document type '%s' is not available in this country", documentType.name()));
        }

        onfido().withSteps("poa").init(PoAIntro.class)
                .startVerification()
                .select("United", PoADocumentSelection.class)
                .select(documentType);

        takePercySnapshot("PoAGuidance-" + documentType.canonicalName());
    }

}
