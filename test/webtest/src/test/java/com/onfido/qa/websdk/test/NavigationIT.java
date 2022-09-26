package com.onfido.qa.websdk.test;

import com.onfido.qa.annotation.Browser;
import com.onfido.qa.websdk.page.*;
import com.onfido.qa.websdk.sdk.FaceStep;
import org.testng.annotations.Test;

import static com.onfido.qa.websdk.DocumentType.PASSPORT;
import static com.onfido.qa.websdk.UploadDocument.FACE;
import static com.onfido.qa.websdk.UploadDocument.PASSPORT_JPG;
import static com.onfido.qa.websdk.sdk.FaceStep.Variant.VIDEO;

public class NavigationIT extends WebSdkIT {

    @Test(description = "should navigate to the second-last step of the flow and then go back to the beginning")
    public void testNavigateToSecondLastStepAndThenBackToBeginning() {
        onfido().withSteps("welcome", "document", new FaceStep().withUseUploader(true), "complete")
                .init(Welcome.class)
                .continueToNextStep(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, DocumentUpload.class)
                .clickUploadButton(ImageQualityGuide.class)
                .upload(PASSPORT_JPG)
                .clickConfirmButton(SelfieUpload.class)
                .upload(FACE)
                .back(SelfieUpload.class)
                .back(ConfirmUpload.class)
                .back(ImageQualityGuide.class)
                .back(DocumentUpload.class)
                .back(RestrictedDocumentSelection.class);

    }

    @Test(description = "should display the face video intro again on back button click when on the face video flow and I have a camera")
    @Browser(enableMicrophoneCameraAccess = true)
    public void testShouldDisplayTheFaceVideoIntroAgainOnBackButtonClickWhenOnTheFaceVideoFlowAndIHaveACamera() {
        onfido().withSteps("document", new FaceStep().withRequestedVariant(VIDEO))
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, DocumentUpload.class)
                .clickUploadButton(ImageQualityGuide.class)
                .upload(PASSPORT_JPG)
                .clickConfirmButton(FaceVideoIntro.class)
                .recordVideo(FaceVideo.class)
                .back(FaceVideoIntro.class);

    }

    @Test(description = "should go back after attempting to continue on phone")
    private void testNavigateToContinueOnMobileAndGoBack() {
        onfido().withSteps("welcome", "document")
                .init(Welcome.class)
                .continueToNextStep(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, DocumentUpload.class)
                .continueOnPhone()
                .back(DocumentUpload.class);

    }
}
