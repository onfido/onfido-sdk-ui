package com.onfido.qa.websdk.test;

import com.onfido.qa.annotation.Browser;
import com.onfido.qa.annotation.Mobile;
import com.onfido.qa.websdk.DocumentType;
import com.onfido.qa.websdk.UploadDocument;
import com.onfido.qa.websdk.model.DocumentOption;
import com.onfido.qa.websdk.page.Complete;
import com.onfido.qa.websdk.page.ConfirmUpload;
import com.onfido.qa.websdk.page.CrossDeviceIntro;
import com.onfido.qa.websdk.page.DocumentLiveCapture;
import com.onfido.qa.websdk.page.DocumentUpload;
import com.onfido.qa.websdk.page.ImageQualityGuide;
import com.onfido.qa.websdk.page.PassportUploaderIntro;
import com.onfido.qa.websdk.page.Permission;
import com.onfido.qa.websdk.page.RestrictedDocumentSelection;
import com.onfido.qa.websdk.page.SelfieUpload;
import com.onfido.qa.websdk.sdk.DocumentStep;
import com.onfido.qa.websdk.sdk.EnterpriseFeatures;
import com.onfido.qa.websdk.sdk.FaceStep;
import com.onfido.qa.websdk.sdk.Raw;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.EnumMap;
import java.util.Map;

import static com.onfido.qa.websdk.DocumentType.DRIVING_LICENCE;
import static com.onfido.qa.websdk.DocumentType.IDENTITY_CARD;
import static com.onfido.qa.websdk.DocumentType.PASSPORT;
import static com.onfido.qa.websdk.DocumentType.RESIDENT_PERMIT;
import static com.onfido.qa.websdk.UploadDocument.BACK_DRIVING_LICENCE_JPG;
import static com.onfido.qa.websdk.UploadDocument.BACK_NATIONAL_IDENTITY_CARD_JPG;
import static com.onfido.qa.websdk.UploadDocument.FACE;
import static com.onfido.qa.websdk.UploadDocument.IDENTITY_CARD_WITH_CUT_OFF;
import static com.onfido.qa.websdk.UploadDocument.IDENTITY_CARD_WITH_GLARE;
import static com.onfido.qa.websdk.UploadDocument.LLAMA_PDF;
import static com.onfido.qa.websdk.UploadDocument.NATIONAL_IDENTITY_CARD_JPG;
import static com.onfido.qa.websdk.UploadDocument.OVER_10MB_PASSPORT;
import static com.onfido.qa.websdk.UploadDocument.PASSPORT_JPG;
import static com.onfido.qa.websdk.UploadDocument.SAMPLE_10MB_PDF;
import static com.onfido.qa.websdk.UploadDocument.UK_DRIVING_LICENCE_PNG;
import static com.onfido.qa.websdk.UploadDocument.UNSUPPORTED_FILE_TYPE;
import static com.onfido.qa.websdk.sdk.DocumentStep.Variant.VIDEO;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;


// TODO: revisit the percy stuff, as we capture too often the same screens

public class DocumentIT extends WebSdkIT {

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

    private ImageQualityGuide gotoPassportUpload() {
        return onfido().withSteps("document", "complete")
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, DocumentUpload.class)
                .clickUploadButton(ImageQualityGuide.class);
    }

    @Test(groups = {"percy"})
    @Mobile
    public void testPermissionDialogIsShown() {

        var permission = onfido()
                .withSteps(new DocumentStep().withUseLiveDocumentCapture(true))
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, Permission.class);

        takePercySnapshot("permission-camera");
        permission.clickEnableCamera(null);

    }

    @Test(groups = {"percy"}, description = "should display document upload screen on desktop browsers when useLiveDocumentCapture is enabled")
    @Mobile
    @Browser(enableMicrophoneCameraAccess = true)
    public void testPassportLiveCapture() {

        var capture = onfido()
                .withSteps(new DocumentStep().withUseLiveDocumentCapture(true))
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, DocumentLiveCapture.class);

        takePercySnapshotWithoutVideo("document-submit-passport useLiveDocumentCapture=true");

        var confirm = capture.takePhoto();
        takePercySnapshotWithoutVideo("document-confirm-passport useLiveDocumentCapture=true");

        confirm.clickConfirmButton(null);

    }

    @Test(description = "should upload a passport and verify UI elements", groups = {"percy"})
    @Mobile
    public void testPassportUploadScreen() {

        var intro = onfido()
                .withSteps(new DocumentStep().withUseLiveDocumentCapture(false), "complete")
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, PassportUploaderIntro.class);

        takePercySnapshot("document-submit-passport-intro useLiveDocumentCapture=false");

        var imageQualityGuide = intro.takePhoto();
        takePercySnapshot("document-submit-passport-quality useLiveDocumentCapture=false");

        var confirmUpload = imageQualityGuide.upload(PASSPORT_JPG);
        takePercySnapshot("document-confirm-passport-confirm useLiveDocumentCapture=false");

        confirmUpload.clickConfirmButton(Complete.class);

    }

    @Test(description = "should upload a passport and verify UI elements", groups = {"percy"})
    public void testShouldUploadAPassportAndVerifyUiElements() {
        var upload = onfido().withSteps("document", "complete").init(RestrictedDocumentSelection.class).selectSupportedCountry().selectDocument(PASSPORT, DocumentUpload.class);

        takePercySnapshot("document-submit-passport-intro");

        upload.clickUploadButton(ImageQualityGuide.class);

        takePercySnapshot("ImageQualityGuide");

    }

    @Test(description = "should upload driving licence and verify UI elements", groups = {"percy"})
    public void testShouldUploadDrivingLicenceAndVerifyUiElements() {
        percyUpload(DRIVING_LICENCE, UK_DRIVING_LICENCE_PNG, BACK_DRIVING_LICENCE_JPG);
    }

    @Test(description = "should upload identity card and verify UI elements", groups = {"percy"})
    public void testShouldUploadIdentityCardAndVerifyUiElements() {
        percyUpload(IDENTITY_CARD, NATIONAL_IDENTITY_CARD_JPG, BACK_NATIONAL_IDENTITY_CARD_JPG);
    }

    @Test(description = "should upload residence permit and verify UI elements", groups = {"percy"})
    public void testShouldUploadResidencePermitAndVerifyUiElements() {
        percyUpload(RESIDENT_PERMIT, NATIONAL_IDENTITY_CARD_JPG, NATIONAL_IDENTITY_CARD_JPG);
    }

    private void percyUpload(DocumentType documentType, UploadDocument front, UploadDocument back) {
        var countrySelector =
                onfido().withSteps("document")
                        .init(RestrictedDocumentSelection.class)
                        .selectSupportedCountry();


        var name = documentType.name();
        takePercySnapshot(format("CountrySelector-%s", name));

        var upload = countrySelector.selectDocument(documentType, DocumentUpload.class);
        takePercySnapshot(format("Upload-%s-Front", name));

        var confirmUpload = upload.upload(front);
        takePercySnapshot(format("ConfirmUpload-%s-Front", name));

        if (documentType.isDoubleSideDocument()) {

            var uploadBack = confirmUpload.clickConfirmButton(DocumentUpload.class);
            takePercySnapshot(format("Upload-%s-Back", name));

            uploadBack.upload(back, ConfirmUpload.class);
            takePercySnapshot(format("ConfirmUpload-%s-Back", name));
        }

    }

    @Test(description = "should return no document message after uploading non-doc image", groups = {"percy"})
    public void testShouldReturnNoDocumentMessageAfterUploadingNonDocImage() {

        var confirmUpload = gotoPassportUpload().upload(LLAMA_PDF).clickConfirmButton(ConfirmUpload.class);

        assertThat(confirmUpload.isErrorShown()).isTrue();

        takePercySnapshot("ConfirmUpload-with-error");

        confirmUpload.clickRedoButton(ImageQualityGuide.class);

    }

    @Test(description = "should return file size too large message for PDF document upload", groups = {"percy"})
    public void testShouldReturnFileSizeTooLargeMessageForPdfDocumentUpload() {
        var imageQualityGuide = gotoPassportUpload().upload(SAMPLE_10MB_PDF, ImageQualityGuide.class);

        assertThat(imageQualityGuide.getErrorMessage()).contains(copy.get("generic.errors.invalid_size.message"));

        takePercySnapshot("ConfirmUpload-with-size-exceeded");
    }


    @Test(description = "should upload a resized document image if file size is too large message")
    public void testShouldUploadAResizedDocumentImageIfFileSizeIsTooLargeMessage() {
        driver().waitFor.timeout(30);
        var confirmUpload = gotoPassportUpload().upload(OVER_10MB_PASSPORT, ConfirmUpload.class).clickConfirmButton(ConfirmUpload.class);

        verifyConfirmErrorMessage(confirmUpload, "glare");

    }

    private void verifyConfirmErrorMessage(ConfirmUpload confirmUpload, String reason) {

        assertThat(confirmUpload.getErrorTitle()).isEqualTo(copy.get("doc_confirmation.alert." + reason + "_title"));
        assertThat(confirmUpload.getInstructionText()).isEqualTo(copy.get("doc_confirmation.alert." + reason + "_detail"));
    }

    @Test(description = "should return \"use another file type\" message")
    public void testShouldReturnUseAnotherFileTypeMessage() {
        var imageQualityGuide = gotoPassportUpload().upload(UNSUPPORTED_FILE_TYPE, ImageQualityGuide.class);

        assertThat(imageQualityGuide.getErrorMessage()).contains(copy.get("generic.errors.invalid_type.message"));

    }

    private ConfirmUpload verifyCroppedImage() {
        var confirmUpload = onfido().withSteps("document")
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(DRIVING_LICENCE, DocumentUpload.class)
                .upload(IDENTITY_CARD_WITH_CUT_OFF)
                .clickConfirmButton(ConfirmUpload.class);

        verifyConfirmErrorMessage(confirmUpload, "crop");

        return confirmUpload;
    }

    private ConfirmUpload verifyCropped2nAttempt() {
        var confirmUpload = verifyCroppedImage();

        confirmUpload.clickRedoButton(DocumentUpload.class).upload(IDENTITY_CARD_WITH_CUT_OFF).clickConfirmButton(ConfirmUpload.class);

        verifyConfirmErrorMessage(confirmUpload, "crop");

        return confirmUpload;
    }

    @Test(description = "should return image quality message on front of doc", groups = {"percy"})
    public void testShouldReturnImageQualityMessageOnFrontOfDoc() {
        verifyCroppedImage();
    }

    @Test(description = "should return image quality message on front of doc - should return an error on the second attempt")
    public void testShouldReturnImageQualityMessageOnFrontOfDocShouldReturnAnErrorOnTheSecondAttempt() {
        verifyCropped2nAttempt();
    }

    @Test(description = "should return image quality message on front of doc - should return a warning on the third attempt", groups = {"percy"})
    public void testShouldReturnImageQualityMessageOnFrontOfDocShouldReturnAWarningOnTheThirdAttempt() {

        var confirmUpload = verifyCropped2nAttempt();

        confirmUpload.clickRedoButton(DocumentUpload.class).upload(IDENTITY_CARD_WITH_GLARE).clickConfirmButton(ConfirmUpload.class);

        verifyConfirmErrorMessage(confirmUpload, "glare");

        takePercySnapshot("ConfirmUpload-with-glare");

    }

    @Test(description = "should return image quality message on back of doc")
    public void testShouldReturnImageQualityMessageOnBackOfDoc() {

        var confirmUpload = onfido().withSteps("document")
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(DRIVING_LICENCE, DocumentUpload.class)
                .upload(NATIONAL_IDENTITY_CARD_JPG)
                .clickConfirmButton(DocumentUpload.class)
                .upload(IDENTITY_CARD_WITH_CUT_OFF)
                .clickConfirmButton(ConfirmUpload.class);

        verifyConfirmErrorMessage(confirmUpload, "crop");

        confirmUpload.clickRedoButton(DocumentUpload.class).upload(IDENTITY_CARD_WITH_CUT_OFF).clickConfirmButton(ConfirmUpload.class);

        verifyConfirmErrorMessage(confirmUpload, "crop");

        confirmUpload.clickRedoButton(DocumentUpload.class).upload(IDENTITY_CARD_WITH_GLARE).clickConfirmButton(ConfirmUpload.class);

        verifyConfirmErrorMessage(confirmUpload, "glare");

    }

    @Test(description = "should be able to retry document upload")
    public void testShouldBeAbleToRetryDocumentUpload() {
        onfido().withSteps(new FaceStep().withUseUploader(true))
                .init(SelfieUpload.class)
                .upload(PASSPORT_JPG)
                .clickRedoButton(SelfieUpload.class)
                .upload(FACE);

    }

    @Test(description = "should be able to submit a document without seeing the document selector screen")
    public void testShouldBeAbleToSubmitADocumentWithoutSeeingTheDocumentSelectorScreen() {
        onfido().withSteps(new DocumentStep().withDocumentType(PASSPORT)).init(DocumentUpload.class);
    }

    @Test(description = "should be taken to the cross-device flow for video capture if there is no camera and docVideo variant requested")
    public void testShouldBeTakenToTheCrossDeviceFlowForVideoCaptureIfThereIsNoCameraAndDocVideoVariantRequested() {
        onfido().withSteps(new DocumentStep().withRequestedVariant(VIDEO))
                .withDisableWebcam()
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, CrossDeviceIntro.class);
    }

    // @TODO: remove this test when we fully support docVideo variant for both desktop & mobile web
    @Test(description = "should be taken to the cross-device flow for video capture docVideo variant requested")
    public void testShouldBeTakenToTheCrossDeviceFlowForVideoCaptureDocVideoVariantRequested() {
        onfido().withSteps(new DocumentStep().withRequestedVariant(VIDEO)).init(RestrictedDocumentSelection.class).selectSupportedCountry().selectDocument(PASSPORT, CrossDeviceIntro.class);
    }

    @Test(description = "should be able to retry document upload when using customized API requests feature and receiving an error response from the callback")
    public void testShouldBeAbleToRetryDocumentUploadWhenUsingCustomizedApiRequestsFeatureAndReceivingAnErrorResponseFromTheCallback() {

        @SuppressWarnings("HardcodedLineSeparator") var promise = new Raw("() => Promise.reject({\n" + "    status: 422,\n" + "    response: JSON.stringify({\n" + "        error: {\n" + "            message: 'There was a validation error on this request',\n" + "            type: 'validation_error',\n" + "            fields: {detect_glare: ['glare found in image']}\n" + "        }\n" + "    })\n" + "})");

        var enterpriseFeatures = new EnterpriseFeatures().withUseCustomizedApiRequests(true)
                .withOnSubmitDocument(promise)
                .withOnSubmitVideo(promise)
                .withOnSubmitDocument(promise);

        var confirmUpload = onfido().withSteps("document", "complete")
                .withEnterpriseFeatures(enterpriseFeatures)
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, DocumentUpload.class)
                .clickUploadButton(ImageQualityGuide.class)
                .upload(IDENTITY_CARD_WITH_GLARE)
                .clickConfirmButton(ConfirmUpload.class);

        verifyConfirmErrorMessage(confirmUpload, "glare");

        confirmUpload.clickRedoButton(ImageQualityGuide.class)
                .upload(NATIONAL_IDENTITY_CARD_JPG)
                .clickConfirmButton(null);

        // TODO: this test seem to have detected a real bug, the glare message stays, even if we uploaded a non glare image in the 2nd try
    }

    @Test(description = "should verify UI elements on the document selection screen", groups = ("percy"))
    public void testShouldVerifyUiElementsOnTheDocumentSelectionScreen() {

        var documentSelector = onfido().withSteps("document")
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry();


        Map<DocumentType, DocumentOption> expectedOptions = new EnumMap<>(DocumentType.class);

        expectedOptions.put(PASSPORT, new DocumentOption(copy.get("doc_select.button_passport"), copy.get("doc_select.button_passport_detail"), null, false));
        expectedOptions.put(DRIVING_LICENCE, new DocumentOption(copy.get("doc_select.button_license"), copy.get("doc_select.button_license_detail"), null, false));
        expectedOptions.put(IDENTITY_CARD, new DocumentOption(copy.get("doc_select.button_id"), copy.get("doc_select.button_id_detail"), null, false));
        expectedOptions.put(RESIDENT_PERMIT, new DocumentOption(copy.get("doc_select.button_permit"), copy.get("doc_select.button_permit_detail"), null, false));


        for (DocumentType documentType : DocumentType.values()) {
            var option = documentSelector.getOption(documentType);
            assertThat(option).isEqualTo(expectedOptions.get(documentType));

        }

    }

    @Test(description = "should verify UI elements not present when disabled on the document selection screen")
    public void testShouldVerifyUiElementsWithDisabledOptionsOnTheDocumentSelectionScreen() {

        var documentSelector = onfido().withSteps(new DocumentStep()
            .withDocumentType(DRIVING_LICENCE,new DocumentStep.Option("FRA"))
            .withDocumentType(PASSPORT,new DocumentStep.Option("FRA"))
            .withoutDocumentType(IDENTITY_CARD)
        )
            .init(RestrictedDocumentSelection.class)
            .selectSupportedCountry();

        assertThat(documentSelector.optionExists(DocumentType.DRIVING_LICENCE)).isEqualTo(true);
        assertThat(documentSelector.optionExists(DocumentType.PASSPORT)).isEqualTo(true);

        assertThat(documentSelector.optionExists(DocumentType.IDENTITY_CARD)).isEqualTo(false);
        assertThat(documentSelector.optionExists(DocumentType.RESIDENT_PERMIT)).isEqualTo(false);
    }
}
