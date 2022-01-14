package com.onfido.qa.websdk.test;

import com.onfido.qa.websdk.UploadDocument;
import com.onfido.qa.websdk.page.ConfirmUpload;
import com.onfido.qa.websdk.page.DocumentUpload;
import com.onfido.qa.websdk.page.IdDocumentSelector;
import com.onfido.qa.websdk.page.PassportUploaderIntro;
import com.onfido.qa.websdk.page.Welcome;
import com.onfido.qa.websdk.sdk.FaceStep;
import org.testng.annotations.Test;

import static com.onfido.qa.websdk.DocumentType.PASSPORT;

public class NavigationIT extends WebSdkIT{

    public NavigationIT() {
    }

    public NavigationIT(String language) {
        super(language);
    }

    @Test(description = "should navigate to the second-last step of the flow and then go back to the beginning")
    public void testNavigateToSecondLastStepAndThenBackToBeginning() {
        onfido().withSteps("welcome", "document", new FaceStep().withUseUploader(true), "complete")
                .init(Welcome.class)
                .continueToNextStep(IdDocumentSelector.class)
                .select(PASSPORT, PassportUploaderIntro.class)
                .takePhoto()
                .upload(UploadDocument.PASSPORT_JPG)
                .clickConfirmButton(DocumentUpload.class)
                .upload(UploadDocument.FACE)
                .back(DocumentUpload.class)
                .back(ConfirmUpload.class);

    }
}
