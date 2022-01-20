package com.onfido.qa.websdk.test;

import com.onfido.qa.websdk.UploadDocument;
import com.onfido.qa.websdk.page.CountrySelector;
import com.onfido.qa.websdk.page.CrossDeviceIntro;
import com.onfido.qa.websdk.page.DocumentUpload;
import com.onfido.qa.websdk.page.IdDocumentSelector;
import com.onfido.qa.websdk.page.ImageQualityGuide;
import com.onfido.qa.websdk.sdk.DocumentStep;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import static com.onfido.qa.websdk.DocumentType.IDENTITY_CARD;
import static com.onfido.qa.websdk.DocumentType.PASSPORT;
import static com.onfido.qa.websdk.UploadDocument.PASSPORT_JPG;

public class MultipleBrowsersDocumentUploadIT extends WebSdkIT {

    public MultipleBrowsersDocumentUploadIT() {
    }

    public MultipleBrowsersDocumentUploadIT(String language) {
        super(language);
    }

    @DataProvider
    public static Object[][] passportDocuments() {
        return new Object[][]{
                {PASSPORT_JPG},
                {UploadDocument.PASSPORT_PDF},
        };
    }

    @Test(description = "should upload passport document", dataProvider = "passportDocuments")
    public void testShouldUploadDocument(UploadDocument document) {
        onfido().withSteps("document", "complete")
                .init(IdDocumentSelector.class)
                .select(PASSPORT, DocumentUpload.class)
                .clickUploadButton(ImageQualityGuide.class)
                .upload(document)
                .clickConfirmButton(null);
    }

    @Test(description = "should upload id document with PDF")
    public void testShouldUploadIdDocumentWithPdf() {
        onfido().withSteps("document", "complete")
                .init(IdDocumentSelector.class)
                .select(IDENTITY_CARD, CountrySelector.class)
                .selectSupportedCountry(DocumentUpload.class)
                .upload(UploadDocument.NATIONAL_IDENTITY_CARD_PDF)
                .clickConfirmButton(null);
    }

    @Test(description = "should show cross device intro screen if camera not detected and uploadFallback disabled")
    public void testShouldShowCrossDeviceIntroScreenIfCameraNotDetectedAndUploadFallbackDisabled() {

        onfido().withSteps(new DocumentStep().withUploadFallback(false), "face", "complete")
                .withDisableWebcam()
                .init(IdDocumentSelector.class)
                .select(PASSPORT, DocumentUpload.class)
                .clickUploadButton(ImageQualityGuide.class)
                .upload(PASSPORT_JPG)
                .clickConfirmButton(CrossDeviceIntro.class);
    }
}
