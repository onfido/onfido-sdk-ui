package com.onfido.qa.websdk.test;

import com.onfido.qa.annotation.Browser;
import com.onfido.qa.annotation.Mobile;
import com.onfido.qa.websdk.DocumentType;
import com.onfido.qa.websdk.UploadDocument;
import com.onfido.qa.websdk.page.Complete;
import com.onfido.qa.websdk.page.DocumentLiveCapture;
import com.onfido.qa.websdk.page.IdDocumentSelector;
import com.onfido.qa.websdk.page.PassportUploaderIntro;
import com.onfido.qa.websdk.page.Permission;
import com.onfido.qa.websdk.sdk.DocumentStep;
import org.testng.annotations.Test;


public class DocumentIT extends WebSdkIT {

    public DocumentIT() {
    }

    public DocumentIT(String language) {
        super(language);
    }


    @Test(groups = {"percy"})
    @Mobile
    public void testPermissionDialogIsShown() {
        var permission = onfido()
                .withSteps(new DocumentStep().withUseLiveDocumentCapture(true))
                .init(IdDocumentSelector.class)
                .select(DocumentType.PASSPORT, Permission.class);

        takePercySnapshot("permission-camera");
        permission.clickEnableCamera(null);
    }


    @Test(
            groups = {"percy"},
            description = "should display document upload screen on desktop browsers when useLiveDocumentCapture is enabled"
    )
    @Mobile
    @Browser(enableMicrophoneCameraAccess = true)
    public void testPassportLiveCapture() {

        var capture = onfido()
                .withSteps(new DocumentStep().withUseLiveDocumentCapture(true), "complete")
                .init(IdDocumentSelector.class)
                .select(DocumentType.PASSPORT, DocumentLiveCapture.class);

        takePercySnapshot("document-submit-passport useLiveDocumentCapture=true");

        var confirm = capture.takePhoto();
        takePercySnapshot("document-confirm-passport useLiveDocumentCapture=true");

        confirm.clickConfirmButton(Complete.class);

    }

    @Test(
            groups = {"percy"},
            description = "should upload a passport and verify UI elements"
    )
    @Mobile
    public void testPassportUploadScreen() {

        var intro = onfido()
                .withSteps(new DocumentStep().withUseLiveDocumentCapture(false), "complete")
                .init(IdDocumentSelector.class)
                .select(DocumentType.PASSPORT, PassportUploaderIntro.class);

        takePercySnapshot("document-submit-passport-intro useLiveDocumentCapture=false");

        var imageQualityGuide = intro.takePhoto();
        takePercySnapshot("document-submit-passport-quality useLiveDocumentCapture=false");

        var confirmUpload = imageQualityGuide.upload(UploadDocument.PASSPORT_JPG);
        takePercySnapshot("document-confirm-passport-confirm useLiveDocumentCapture=false");

        confirmUpload.clickConfirmButton(Complete.class);

    }

}
