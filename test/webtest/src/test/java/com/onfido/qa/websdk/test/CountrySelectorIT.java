package com.onfido.qa.websdk.test;

import com.onfido.qa.webdriver.common.Page;
import com.onfido.qa.websdk.DocumentType;
import com.onfido.qa.websdk.UploadDocument;
import com.onfido.qa.websdk.page.CountrySelector;
import com.onfido.qa.websdk.page.DocumentUpload;
import com.onfido.qa.websdk.page.IdDocumentSelector;
import com.onfido.qa.websdk.page.Welcome;
import com.onfido.qa.websdk.sdk.DocumentStep;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import static com.google.common.truth.Truth.assertThat;
import static com.onfido.qa.websdk.DocumentType.DRIVING_LICENCE;
import static com.onfido.qa.websdk.DocumentType.IDENTITY_CARD;
import static com.onfido.qa.websdk.DocumentType.PASSPORT;
import static com.onfido.qa.websdk.DocumentType.RESIDENT_PERMIT;

public class CountrySelectorIT extends WebSdkIT {

    @SuppressWarnings("unused")
    public CountrySelectorIT() {
        super();
    }

    public CountrySelectorIT(String language) {
        super(language);
    }

    @DataProvider
    public static Object[][] documentTypesWithCountrySelection() {
        return new Object[][]{
                {DRIVING_LICENCE},
                {IDENTITY_CARD}
        };
    }

    @DataProvider
    public static Object[][] documentTypesWithoutCountrySelection() {
        return new Object[][]{
                {PASSPORT}
        };
    }

    @Test(
            dataProvider = "documentTypesWithoutCountrySelection",
            description = "should not display country selection screen for certain document type selected"
    )
    public void testCountryNotSelectionShown(DocumentType documentType) {
        var upload = selectDocument(documentType, DocumentUpload.class);

        verifyCopy(upload.title(), "doc_submit.title_passport");

    }

    @Test(
            dataProvider = "documentTypesWithCountrySelection",
            description = "should display country selection screen for certain document type selected"
    )
    public void testCountrySelectionShown(DocumentType documentType) {
        var countrySelector = selectDocument(documentType, CountrySelector.class);

        verifyCopy(countrySelector.title(), "country_select.title");
        verifyCopy(countrySelector.selectorLabel(), "country_select.search.label");

        assertThat(countrySelector.countryFinderInput().isDisplayed()).isTrue();
        assertThat(countrySelector.submitDocumentBtn().isEnabled()).isFalse();

    }

    @Test(
            description = "should skip country selection screen and successfully upload a document when only residence permit document type preselected"
    )
    public void testSkipCountryScreenForResidencePermit() {
        var welcome = onfido(language).withSteps("welcome", new DocumentStep().withDocumentType(RESIDENT_PERMIT)).init(Welcome.class);
        var documentUpload = welcome.continueToNextStep(DocumentUpload.class);

        verifyCopy(documentUpload.title(), "doc_submit.title_permit_front");

        var confirm = documentUpload.upload(UploadDocument.UK_DRIVING_LICENCE_PNG);
        verifyCopy(confirm.title(), "doc_confirmation.title");
        verifyCopy(confirm.message(), "doc_confirmation.body_permit");

        var documentUploadBack = confirm.clickConfirmButton(DocumentUpload.class);
        verifyCopy(documentUploadBack.title(), "doc_submit.title_permit_back");

    }

    @Test(
            description = "should skip country selection screen and successfully upload a document when multiple document types have country preset"
    )
    public void testSkippingCountrySelectionIfPreset() {

        var welcome =
                onfido()
                        .withSteps(
                                "welcome",
                                new DocumentStep()
                                        .withDocumentType(DRIVING_LICENCE, new DocumentStep.Option("ESP"))
                                        .withDocumentType(IDENTITY_CARD, new DocumentStep.Option("MYS"))
                                        .withDocumentType(RESIDENT_PERMIT, new DocumentStep.Option(null))
                        )
                        .init(Welcome.class);

        var documentSelector = welcome.continueToNextStep(IdDocumentSelector.class);
        var documentUpload = documentSelector.select(DRIVING_LICENCE, DocumentUpload.class);

        verifyCopy(documentUpload.title(), "doc_submit.title_license_front");
        documentSelector = documentUpload.back(IdDocumentSelector.class);

        documentUpload = documentSelector.select(IDENTITY_CARD, DocumentUpload.class);
        verifyCopy(documentUpload.title(), "doc_submit.title_id_front");

        documentSelector = documentUpload.back(IdDocumentSelector.class);
        documentUpload = documentSelector.select(RESIDENT_PERMIT, DocumentUpload.class);

        verifyCopy(documentUpload.title(), "doc_submit.title_permit_front");

        var confirm = documentUpload.upload(UploadDocument.NATIONAL_IDENTITY_CARD_JPG);
        verifyCopy(confirm.title(), "doc_confirmation.title");
        verifyCopy(confirm.message(), "doc_confirmation.body_permit");

        var documentUploadBack = confirm.clickConfirmButton(DocumentUpload.class);
        verifyCopy(documentUploadBack.title(), "doc_submit.title_permit_back");

    }

    private <T extends Page> T selectDocument(DocumentType documentType, Class<T> next) {


        return onfido().init(Welcome.class)
                       .continueToNextStep(IdDocumentSelector.class)
                       .select(documentType, next);
    }

}
