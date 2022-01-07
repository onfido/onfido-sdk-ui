package com.onfido.qa.websdk.test;

import com.onfido.qa.websdk.PoADocumentType;
import com.onfido.qa.websdk.page.Complete;
import com.onfido.qa.websdk.page.PoAIntro;
import com.onfido.qa.websdk.page.Welcome;
import io.percy.selenium.Percy;
import org.testng.SkipException;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.Arrays;

public class PercyIT extends WebSdkIT {

    public static final int MIN = 500;
    public static final int SLEEP_BEFORE_SNAPSHOT = 250;
    private Percy percy;

    public PercyIT() {
    }

    public PercyIT(String language) {
        super(language);
    }

    @DataProvider(name = "poaDocumentTypes")
    public static Object[][] poaDocumentTypes() {

        return Arrays.stream(PoADocumentType.values()).map(x-> {return new Object[]{x};}).toArray(Object[][]::new);
    }

    @BeforeMethod
    public void beforeTest() {
        percy = new Percy(driver());
    }

    private void snapshot(String name) {
        try {
            Thread.sleep(SLEEP_BEFORE_SNAPSHOT);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        percy.snapshot(String.format("%s-%s", name, language), Arrays.asList(MIN));
    }

    @Test
    public void welcome() {
        var welcome = onfido().withSteps("welcome", "complete").init(Welcome.class);
        snapshot("Welcome");

        welcome.continueToNextStep(Complete.class);
        snapshot("Complete");

    }

    @Test
    public void poa() {
        var intro = onfido().withSteps("poa").init(PoAIntro.class);
        snapshot("PoAIntro");

        intro.startVerification();
        snapshot("PoADocumentSelection");

    }

    @Test(dataProvider = "poaDocumentTypes")
    public void poaGuidance(PoADocumentType documentType) {

        // TODO: initialize with correct country
        if (!documentType.availableInCountry("GBR")) {
            throw new SkipException(String.format("Cannot execute test, as the document type '%s' is not available in this country", documentType.name()));
        }

        onfido().withSteps("poa").init(PoAIntro.class)
                .startVerification()
                .select(documentType);

        snapshot("PoAGuidance-" + documentType.canonicalName());
    }
}
