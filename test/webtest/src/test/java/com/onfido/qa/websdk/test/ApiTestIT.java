package com.onfido.qa.websdk.test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.onfido.qa.websdk.UploadDocument;
import com.onfido.qa.websdk.model.CompleteData;
import com.onfido.qa.websdk.page.Complete;
import com.onfido.qa.websdk.page.CrossDeviceClientIntro;
import com.onfido.qa.websdk.page.CrossDeviceClientSuccess;
import com.onfido.qa.websdk.page.CrossDeviceMobileConnected;
import com.onfido.qa.websdk.page.CrossDeviceSubmit;
import com.onfido.qa.websdk.page.DocumentUpload;
import com.onfido.qa.websdk.page.ImageQualityGuide;
import com.onfido.qa.websdk.page.RestrictedDocumentSelection;
import com.onfido.qa.websdk.page.SelfieUpload;
import com.onfido.qa.websdk.sdk.FaceStep;
import com.onfido.qa.websdk.sdk.Raw;
import org.testng.annotations.Test;

import static com.onfido.qa.websdk.DocumentType.PASSPORT;
import static org.assertj.core.api.Assertions.assertThat;

@SuppressWarnings("OverlyCoupledMethod")
public class ApiTestIT extends WebSdkIT {

    public static final Raw RECORD_COMPLETE_DATA = new Raw("(data) => window.onCompleteData = data");

    @Test(description = "onComplete is invoked on regular flow")
    public void testOnCompleteIsInvokedOnRegularFlow() {
        onfido().withOnComplete(RECORD_COMPLETE_DATA)
                .withSteps("document", "complete")
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, DocumentUpload.class)
                .clickUploadButton(ImageQualityGuide.class)
                .upload(UploadDocument.PASSPORT_JPG)
                .clickConfirmButton(Complete.class);

        CompleteData completeData = getCompleteData();

        var documentFront = completeData.document_front;
        assertThat(documentFront.side).isEqualTo("front");
        assertThat(documentFront.type).isEqualTo("passport");

        assertThat(completeData.document_back).isNull();
        assertThat(completeData.poa).isNull();

    }

    private CompleteData getCompleteData() {
        var json = (String) driver().executeScript("return JSON.stringify(window.onCompleteData)");
        try {
            return objectMapper.readValue(json, CompleteData.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Test(description = "full CrossDevice flow invokes onComplete")
    public void testFullCrossDeviceFlowInvokesOnComplete() {
        var secureLink = onfido().withOnComplete(RECORD_COMPLETE_DATA)
                                 .withSteps("document", new FaceStep().withUseUploader(true), "complete")
                                 .init(RestrictedDocumentSelection.class)
                                 .selectSupportedCountry()
                                 .selectDocument(PASSPORT, DocumentUpload.class)
                                 .switchToCrossDevice()
                                 .getSecureLink()
                                 .copyLink();

        openMobileScreen(secureLink);

        switchToMainScreen();
        verifyPage(CrossDeviceMobileConnected.class);

        switchToMobileScreen();
        verifyPage(CrossDeviceClientIntro.class)
                .clickContinue(DocumentUpload.class)
                .clickUploadButton(ImageQualityGuide.class)
                .upload(UploadDocument.PASSPORT_JPG)
                .clickConfirmButton(SelfieUpload.class)
                .upload(UploadDocument.FACE).clickConfirmButton(CrossDeviceClientSuccess.class);

        switchToMainScreen();

        verifyPage(CrossDeviceSubmit.class).submitVerification();

        var completeData = getCompleteData();
        var documentFront = completeData.document_front;

        assertThat(documentFront.side).isEqualTo("front");
        assertThat(documentFront.type).isEqualTo("passport");
        assertThat(completeData.poa).isNull();
        assertThat(completeData.document_back).isNull();
        assertThat(completeData.face).isNotNull();
    }

    @Test(description = "half CrossDevice flow invokes onComplete")
    public void testHalfCrossDeviceFlowInvokesOnComplete() {

        var secureLink = onfido().withOnComplete(RECORD_COMPLETE_DATA)
                                 .withSteps("document", new FaceStep().withUseUploader(true), "complete")
                                 .init(RestrictedDocumentSelection.class)
                                 .selectSupportedCountry()
                                 .selectDocument(PASSPORT, DocumentUpload.class)
                                 .clickUploadButton(ImageQualityGuide.class)
                                 .upload(UploadDocument.PASSPORT_JPG)
                                 .clickConfirmButton(SelfieUpload.class)
                                 .switchToCrossDevice()
                                 .getSecureLink()
                                 .copyLink();

        openMobileScreen(secureLink);

        switchToMainScreen();
        verifyPage(CrossDeviceMobileConnected.class);

        switchToMobileScreen();
        verifyPage(SelfieUpload.class)
                .upload(UploadDocument.FACE)
                .clickConfirmButton(CrossDeviceClientSuccess.class);

        switchToMainScreen();

        verifyPage(CrossDeviceSubmit.class).submitVerification();

        var completeData = getCompleteData();
        var documentFront = completeData.document_front;

        assertThat(documentFront.side).isEqualTo("front");
        assertThat(documentFront.type).isEqualTo("passport");
        assertThat(completeData.poa).isNull();
        assertThat(completeData.document_back).isNull();
        assertThat(completeData.face).isNotNull();

    }
}
