package com.onfido.qa.websdk.test;

import com.onfido.qa.websdk.DocumentType;
import com.onfido.qa.websdk.UploadDocument;
import com.onfido.qa.websdk.page.CountrySelector;
import com.onfido.qa.websdk.page.DocumentUpload;
import com.onfido.qa.websdk.page.IdDocumentSelector;
import com.onfido.qa.websdk.page.RestrictedDocumentSelection;
import com.onfido.qa.websdk.page.Welcome;
import com.onfido.qa.websdk.sdk.DocumentStep;
import com.onfido.qa.websdk.sdk.DocumentStep.Option;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import static com.onfido.qa.websdk.DocumentType.DRIVING_LICENCE;
import static com.onfido.qa.websdk.DocumentType.IDENTITY_CARD;
import static com.onfido.qa.websdk.DocumentType.PASSPORT;
import static com.onfido.qa.websdk.DocumentType.RESIDENT_PERMIT;
import static com.onfido.qa.websdk.UploadDocument.NATIONAL_IDENTITY_CARD_JPG;
import static com.onfido.qa.websdk.UploadDocument.UK_DRIVING_LICENCE_PNG;
import static org.assertj.core.api.Assertions.assertThat;

public class RestrictedDocumentSelectionIT extends WebSdkIT {

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

        var upload = onfido().init(Welcome.class)
                             .continueToNextStep(RestrictedDocumentSelection.class)
                             .selectCountry(RestrictedDocumentSelection.SUPPORTED_COUNTRY)
                             .selectDocument(documentType, DocumentUpload.class);

        verifyCopy(upload.title(), "doc_submit.title_passport");

    }

    @Test(
            dataProvider = "documentTypesWithCountrySelection",
            description = "should display country selection screen for certain document type selected"
    )
    public void testCountrySelectionShown(DocumentType documentType) {


        var countrySelector = onfido().init(Welcome.class)
                                      .continueToNextStep(IdDocumentSelector.class)
                                      .select(documentType, CountrySelector.class);

        verifyCopy(countrySelector.title(), "country_select.title");
        verifyCopy(countrySelector.selectorLabel(), "country_select.search.label");

        assertThat(countrySelector.countryFinderInput().isDisplayed()).isTrue();
        assertThat(countrySelector.isSubmitBtnEnabled()).isFalse();

    }

    @Test(
            description = "should skip country selection screen and successfully upload a document when only residence permit document type preselected"
    )
    public void testSkipCountryScreenForResidencePermit() {
        var welcome = onfido().withSteps("welcome", new DocumentStep().withDocumentType(RESIDENT_PERMIT)).init(Welcome.class);
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
                                        .withDocumentType(DRIVING_LICENCE, new Option("ESP"))
                                        .withDocumentType(IDENTITY_CARD, new Option("MYS"))
                                        .withDocumentType(RESIDENT_PERMIT, new Option(null))
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

        var confirm = documentUpload.upload(NATIONAL_IDENTITY_CARD_JPG);
        verifyCopy(confirm.title(), "doc_confirmation.title");
        verifyCopy(confirm.message(), "doc_confirmation.body_permit");

        var documentUploadBack = confirm.clickConfirmButton(DocumentUpload.class);
        verifyCopy(documentUploadBack.title(), "doc_submit.title_permit_back");

    }

    @Test(description = "should show country selection screen for driver's license and national ID given invalid country code")
    public void testShowCountrySelectionWithInvalidCountryCode() {

        onfido()
                .withSteps("welcome", new DocumentStep().withDocumentType(DRIVING_LICENCE, new Option("ES"))
                                                        .withDocumentType(IDENTITY_CARD, new Option("XYZ")))
                .init(Welcome.class)
                .continueToNextStep(IdDocumentSelector.class).select(DRIVING_LICENCE, CountrySelector.class)
                .back(IdDocumentSelector.class)
                .select(IDENTITY_CARD, CountrySelector.class).select(CountrySelector.SUPPORTED_COUNTRY, DocumentUpload.class)
                .upload(NATIONAL_IDENTITY_CARD_JPG)
                .clickConfirmButton(DocumentUpload.class);
    }

    @Test(description = "should skip country selection screen and successfully upload document when only driver's license preselected with a valid country code")
    public void testSkipCountrySelection() {

        onfido()
                .withSteps(new DocumentStep().withDocumentType(DRIVING_LICENCE, new Option("ESP")))
                .init(DocumentUpload.class)
                .upload(UK_DRIVING_LICENCE_PNG)
                .clickConfirmButton(DocumentUpload.class);
    }


    @Test(description = "should show country selection screen with only driver's license preselected and showCountrySelection enabled")
    public void testShowCountrySelectionWithShowCountrySelectionEnabled() {
        var countrySelector = onfido()
                .withSteps(new DocumentStep().withDocumentType(DRIVING_LICENCE, true).withShowCountrySelection(true))
                .init(CountrySelector.class);

        assertThat(countrySelector.isSubmitBtnEnabled()).isFalse();
    }

    @Test(description = "should show country selection screen when multiple documents enabled with boolean values (legacy config)")
    public void testShowCountrySelectionWithMultipleDocsEnabled() {
        onfido()
                .withSteps(new DocumentStep().withDocumentType(DRIVING_LICENCE, true).withDocumentType(IDENTITY_CARD, true))
                .init(IdDocumentSelector.class)
                .select(IDENTITY_CARD, CountrySelector.class)
                .select(CountrySelector.SUPPORTED_COUNTRY, DocumentUpload.class)
                .upload(NATIONAL_IDENTITY_CARD_JPG)
                .clickConfirmButton(DocumentUpload.class);
    }

    @Test(description = "should go to document upload screen when a supported country is selected")
    public void testGoToUploadScreenWhenASupportedCountryIsSelected() {
        onfido().withSteps("document")
                .init(IdDocumentSelector.class)
                .select(IDENTITY_CARD, CountrySelector.class)
                .select(CountrySelector.SUPPORTED_COUNTRY, DocumentUpload.class);
    }

    @Test(description = "should be able to select \"Hong Kong\" as a supported country option when searching with \"香\"")
    public void testSelectHongKong() {
        var countrySelector = onfido().withSteps("document")
                                      .init(IdDocumentSelector.class)
                                      .select(IDENTITY_CARD, CountrySelector.class)
                                      .searchFor("香 ")
                                      .selectFirstOptionInDropdownMenu();

        assertThat(countrySelector.isSubmitBtnEnabled()).isTrue();

    }

    // FIXME: bug
    @Test(description = "should display \"Country not found\" message and error variant of help icon when searching for \"xyz\"", enabled = false)
    public void testCountryNotFoundMessage() {
        var countrySelector = onfido().withSteps("document")
                                      .init(IdDocumentSelector.class)
                                      .select(IDENTITY_CARD, CountrySelector.class)
                                      .select("xyz");

        assertThat(countrySelector.countryNotFoundMessageIdDisabled()).isTrue();
    }
}

