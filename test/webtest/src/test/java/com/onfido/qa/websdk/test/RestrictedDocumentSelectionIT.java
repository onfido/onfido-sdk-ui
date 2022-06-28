package com.onfido.qa.websdk.test;

import com.onfido.qa.websdk.DocumentType;
import com.onfido.qa.websdk.UploadDocument;
import com.onfido.qa.websdk.page.DocumentUpload;
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
            description = "should not display Restricted Document selection screen for certain document type selected"
    )
    public void testCountryNotSelectionShown(DocumentType documentType) {

        var upload = onfido().init(Welcome.class)
                             .continueToNextStep(RestrictedDocumentSelection.class)
                             .selectSupportedCountry()
                             .selectDocument(documentType, DocumentUpload.class);

        verifyCopy(upload.title(), "doc_submit.title_passport");

    }

    @Test(
            dataProvider = "documentTypesWithCountrySelection",
            description = "should display Restricted Document selection screen for certain document type selected"
    )
    public void testCountrySelectionShown(DocumentType documentType) {


        var countrySelector = onfido().init(Welcome.class)
                                      .continueToNextStep(RestrictedDocumentSelection.class);


        verifyCopy(countrySelector.title(), "doc_select.title");
        verifyCopy(countrySelector.selectorLabel(), "doc_select.section.header_country");

        assertThat(countrySelector.countryFinderInput().isDisplayed()).isTrue();

    }

    @Test(
            description = "should skip Restricted document selection screen and successfully upload a document when only residence permit document type preselected"
    )
    public void testSkipCountryScreenForResidencePermit() {
        var welcome = onfido().withSteps("welcome", new DocumentStep().withDocumentType(RESIDENT_PERMIT, new Option("ESP"))).init(Welcome.class);
        var documentUpload = welcome.continueToNextStep(DocumentUpload.class);

        verifyCopy(documentUpload.title(), "doc_submit.title_permit_front");

        var confirm = documentUpload.upload(UploadDocument.UK_DRIVING_LICENCE_PNG);
        verifyCopy(confirm.title(), "doc_confirmation.title");
        verifyCopy(confirm.message(), "doc_confirmation.body_permit");

        var documentUploadBack = confirm.clickConfirmButton(DocumentUpload.class);
        verifyCopy(documentUploadBack.title(), "doc_submit.title_permit_back");

    }

    @Test(
            description = "should successfully upload a document when multiple document types have country preset, and ignore 'null' country"
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

        var documentSelector = welcome.continueToNextStep(RestrictedDocumentSelection.class).selectCountry("spain");
        var documentUpload = documentSelector.selectDocument(DRIVING_LICENCE, DocumentUpload.class);

        verifyCopy(documentUpload.title(), "doc_submit.title_license_front");
        documentSelector = documentUpload.back(RestrictedDocumentSelection.class).selectCountry("malaysia");

        documentUpload = documentSelector.selectDocument(IDENTITY_CARD, DocumentUpload.class);
        verifyCopy(documentUpload.title(), "doc_submit.title_id_front");

        var confirm = documentUpload.upload(NATIONAL_IDENTITY_CARD_JPG);
        verifyCopy(confirm.title(), "doc_confirmation.title");
        verifyCopy(confirm.message(), "doc_confirmation.body_permit");

        var documentUploadBack = confirm.clickConfirmButton(DocumentUpload.class);
        verifyCopy(documentUploadBack.title(), "doc_submit.title_id_back");

    }

    @Test(description = "should show country selection screen for driver's license and national ID given valid country code")
    public void testShowCountrySelectionWithValidCountryCode() {

        onfido()
                .withSteps("welcome", new DocumentStep().withDocumentType(DRIVING_LICENCE, new Option("ES"))
                                                        .withDocumentType(IDENTITY_CARD, new Option("ES")))
                .init(Welcome.class)
                .continueToNextStep(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(DRIVING_LICENCE, DocumentUpload.class)

                .back(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(IDENTITY_CARD, DocumentUpload.class)
                .upload(NATIONAL_IDENTITY_CARD_JPG)
                .clickConfirmButton(DocumentUpload.class);
    }

    @Test(description = "should skip Restricted Document selection screen and successfully upload document when only driver's license preselected with a valid country code")
    public void testSkipCountrySelection() {

        onfido()
                .withSteps(new DocumentStep().withDocumentType(DRIVING_LICENCE, new Option("ESP")))
                .init(DocumentUpload.class)
                .upload(UK_DRIVING_LICENCE_PNG)
                .clickConfirmButton(DocumentUpload.class);
    }


    @Test(description = "should show Restricted Document selection screen when multiple documents enabled with boolean values (legacy config)")
    public void testShowCountrySelectionWithMultipleDocsEnabled() {
        onfido()
                .withSteps(new DocumentStep().withDocumentType(DRIVING_LICENCE, true).withDocumentType(IDENTITY_CARD, true))
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(IDENTITY_CARD, DocumentUpload.class)
                .upload(NATIONAL_IDENTITY_CARD_JPG)
                .clickConfirmButton(DocumentUpload.class);
    }

    @Test(description = "should go to document upload screen when a supported country + document is selected")
    public void testGoToUploadScreenWhenASupportedCountryIsSelected() {
        onfido().withSteps("document")
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(IDENTITY_CARD, DocumentUpload.class);
    }

    @Test(description = "should be able to select \"Hong Kong\" as a supported country option when searching with \"香\"")
    public void testSelectHongKong() {
        onfido().withSteps("document")
                .init(RestrictedDocumentSelection.class)
                .searchFor("香 ")
                .selectFirstOptionInDropdownMenu()
                .selectDocument(IDENTITY_CARD, DocumentUpload.class);

    }

    // FIXME: bug
    @Test(description = "should display \"Country not found\" message and error variant of help icon when searching for \"xyz\"", enabled = false)
    public void testCountryNotFoundMessage() {
        var countrySelector = onfido().withSteps("document")
                                      .init(RestrictedDocumentSelection.class)
                                      .selectCountry("xyz");

        assertThat(countrySelector.countryNotFoundMessageIdDisabled()).isTrue();
    }
}

