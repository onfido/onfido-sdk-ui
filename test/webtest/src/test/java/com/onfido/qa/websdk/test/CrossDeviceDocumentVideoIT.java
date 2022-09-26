package com.onfido.qa.websdk.test;

import com.onfido.qa.annotation.Browser;
import com.onfido.qa.websdk.DocumentType;
import com.onfido.qa.websdk.page.CrossDeviceClientIntro;
import com.onfido.qa.websdk.page.CrossDeviceIntro;
import com.onfido.qa.websdk.page.DocumentVideoCapture;
import com.onfido.qa.websdk.page.DocumentVideoConfirm;
import com.onfido.qa.websdk.page.RestrictedDocumentSelection;
import com.onfido.qa.websdk.sdk.DocumentStep;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.Arrays;

import static com.onfido.qa.websdk.DocumentType.DRIVING_LICENCE;
import static com.onfido.qa.websdk.DocumentType.IDENTITY_CARD;
import static com.onfido.qa.websdk.DocumentType.PASSPORT;
import static com.onfido.qa.websdk.DocumentType.RESIDENT_PERMIT;
import static com.onfido.qa.websdk.sdk.DocumentStep.Variant.VIDEO;
import static org.assertj.core.api.Assertions.assertThat;

public class CrossDeviceDocumentVideoIT extends WebSdkIT {

    @DataProvider(name = "documentTypes")
    public static Object[][] documentTypes() {

        return Arrays.stream(DocumentType.values()).map(x -> {
            return new Object[]{x};
        }).toArray(Object[][]::new);
    }

    @Test(description = "should start the ANSSI flow for Passport flow and attempt to upload", groups = {"percy"})
    @Browser(enableMicrophoneCameraAccess = true)
    public void testShouldStartTheAnssiFlowForPassportFlowAndAttemptToUpload() {

        var link = onfido().withSteps(new DocumentStep().withRequestedVariant(VIDEO))
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(PASSPORT, CrossDeviceIntro.class)
                .getSecureLink()
                .copyLink();

        openMobileScreen(link);
        var videoCapture = verifyPage(CrossDeviceClientIntro.class).clickContinue(DocumentVideoCapture.class);

        assertThat(videoCapture.isPassportOverlayDisplayed()).isTrue();
        verifyCopy(videoCapture.videoTitle(), "doc_video_capture.header_passport");

        takePercySnapshotWithoutVideo("DocumentVideoCapture-Intro");

        videoCapture.clickRecordButton();
        assertThat(videoCapture.isOverlayPlaceholderDisplayed()).isTrue();
        verifyCopy(videoCapture.videoTitle(), "doc_video_capture.header_step1");

        takePercySnapshotWithoutVideo("DocumentVideoCapture");

        videoCapture.waitForCaptureButton();
        verifyCopy(videoCapture.buttonText(), "doc_video_capture.button_primary_fallback");
        videoCapture.clickRecordButton();

        videoCapture.waitForUploadToComplete();
        assertThat(videoCapture.successTick().isDisplayed()).isTrue();

        takePercySnapshotWithoutVideo("DocumentVideoCapture-Success");

        var documentVideoConfirm = verifyPage(DocumentVideoConfirm.class);

        assertThat(documentVideoConfirm.backArrow().isDisplayed()).isTrue();
        assertThat(documentVideoConfirm.confirmIcon().isDisplayed()).isTrue();
        verifyCopy(documentVideoConfirm.confirmMessage(), "video_confirmation.body");

    }

    @Test(description = "should start the ANSSI flow for Identity Card flow and attempt to upload", groups = {"percy", "ANSSI"})
    @Browser(enableMicrophoneCameraAccess = true)
    public void testShouldStartTheAnssiFlowForIdentityCardFlowAndAttemptToUpload() {

        var link = onfido().withSteps(new DocumentStep().withRequestedVariant(VIDEO))
                .init(RestrictedDocumentSelection.class)
                .selectCountry("italy")
                .selectDocument(IDENTITY_CARD, CrossDeviceIntro.class)
                .getSecureLink()
                .copyLink();

        openMobileScreen(link);
        var videoCapture = verifyPage(CrossDeviceClientIntro.class).clickContinue(DocumentVideoCapture.class);

        assertThat(videoCapture.isOverlayPlaceholderDisplayed()).isTrue();
        assertThat(videoCapture.paperOrPlasticCard().isDisplayed()).isTrue();
        assertThat(videoCapture.plasticCardButton().isDisplayed()).isTrue();
        assertThat(videoCapture.paperDocumentButton().isDisplayed()).isTrue();

        takePercySnapshotWithoutVideo("DocumentVideoCapture-IdentityCard-Intro");

        videoCapture.plasticCardButton().click();
        assertThat(videoCapture.cardOverlay().isDisplayed()).isTrue();

        takePercySnapshotWithoutVideo("DocumentVideoCapture-IdentityCard-Cardoverlay");

        videoCapture.clickRecordButton();
        videoCapture.waitForCaptureButton();
        assertThat(videoCapture.steps().isDisplayed()).isTrue();
        videoCapture.clickRecordButton();

        videoCapture.waitForTickToDisappear();
        verifyCopy(videoCapture.videoTitle(), "doc_video_capture.header_step2");
        takePercySnapshotWithoutVideo("DocumentVideoCapture-IdentityCard-2nd-Step");

        videoCapture.clickRecordButton();
        var documentVideoConfirm = verifyPage(DocumentVideoConfirm.class);

        assertThat(documentVideoConfirm.backArrow().isDisplayed()).isTrue();
        assertThat(documentVideoConfirm.confirmIcon().isDisplayed()).isTrue();
        verifyCopy(documentVideoConfirm.confirmMessage(), "video_confirmation.body");

    }

    @Test(description = "should start the ANSSI flow for Drivers license flow and attempt to upload", groups = {"percy", "ANSSI"})
    @Browser(enableMicrophoneCameraAccess = true)
    public void testShouldStartTheAnssiFlowForDriversLicenseFlowAndAttemptToUpload() {

        var link = onfido().withSteps(new DocumentStep().withRequestedVariant(VIDEO))
                .init(RestrictedDocumentSelection.class)
                .selectSupportedCountry()
                .selectDocument(DRIVING_LICENCE, CrossDeviceIntro.class)
                .getSecureLink()
                .copyLink();

        openMobileScreen(link);
        var videoCapture = verifyPage(CrossDeviceClientIntro.class).clickContinue(DocumentVideoCapture.class);

        assertThat(videoCapture.isOverlayPlaceholderDisplayed()).isTrue();
        assertThat(videoCapture.paperOrPlasticCard().isDisplayed()).isTrue();
        assertThat(videoCapture.plasticCardButton().isDisplayed()).isTrue();
        assertThat(videoCapture.paperDocumentButton().isDisplayed()).isTrue();

        takePercySnapshotWithoutVideo("DocumentVideoCapture-DrivingLicense-Intro");

        videoCapture.paperDocumentButton().click();
        assertThat(videoCapture.frenchDriverLicenseOverlay().isDisplayed()).isTrue();

        takePercySnapshotWithoutVideo("DocumentVideoCapture-DrivingLicense-Cardoverlay");

        videoCapture.clickRecordButton();
        videoCapture.waitForCaptureButton();
        assertThat(videoCapture.steps().isDisplayed()).isTrue();
        videoCapture.clickRecordButton();

        videoCapture.waitForTickToDisappear();
        verifyCopy(videoCapture.videoTitle(), "doc_video_capture.header_paper_doc_step2");
        takePercySnapshotWithoutVideo("DocumentVideoCapture-DrivingLicense-2nd-Step");

        videoCapture.clickRecordButton();
        var documentVideoConfirm = verifyPage(DocumentVideoConfirm.class);

        assertThat(documentVideoConfirm.backArrow().isDisplayed()).isTrue();
        assertThat(documentVideoConfirm.confirmIcon().isDisplayed()).isTrue();
        verifyCopy(documentVideoConfirm.confirmMessage(), "video_confirmation.body");

    }


    @Test(description = "should start the ANSSI flow for Residence permit flow and attempt to upload", groups = {"percy", "ANSSI"})
    @Browser(enableMicrophoneCameraAccess = true)
    public void testShouldStartTheAnssiFlowForResidencePermitFlowAndAttemptToUpload() {

        var link = onfido().withSteps(new DocumentStep().withRequestedVariant(VIDEO))
                .init(RestrictedDocumentSelection.class)
                .selectCountry("United Kingdom")
                .selectDocument(RESIDENT_PERMIT, CrossDeviceIntro.class)
                .getSecureLink()
                .copyLink();

        openMobileScreen(link);
        var videoCapture = verifyPage(CrossDeviceClientIntro.class).clickContinue(DocumentVideoCapture.class);

        assertThat(videoCapture.cardOverlay().isDisplayed()).isTrue();

        takePercySnapshotWithoutVideo("DocumentVideoCapture-ResidentPermit-Cardoverlay");

        videoCapture.clickRecordButton();
        videoCapture.waitForCaptureButton();
        assertThat(videoCapture.steps().isDisplayed()).isTrue();
        videoCapture.clickRecordButton();

        videoCapture.waitForTickToDisappear();
        verifyCopy(videoCapture.videoTitle(), "doc_video_capture.header_step2");
        takePercySnapshotWithoutVideo("DocumentVideoCapture-ResidentPermit-2nd-Step");

        videoCapture.clickRecordButton();
        var documentVideoConfirm = verifyPage(DocumentVideoConfirm.class);

        assertThat(documentVideoConfirm.backArrow().isDisplayed()).isTrue();
        assertThat(documentVideoConfirm.confirmIcon().isDisplayed()).isTrue();
        verifyCopy(documentVideoConfirm.confirmMessage(), "video_confirmation.body");

    }

    @Test(description = "should show \"Camera not working\" error in ANSSI flow", groups = {"percy", "ANSSI"})
    @Browser(enableMicrophoneCameraAccess = true)
    public void testShouldShowCameraNotWorkingErrorInAnssiFlow() {

        var link = onfido().withSteps(new DocumentStep().withRequestedVariant(VIDEO))
                .init(RestrictedDocumentSelection.class)
                .selectCountry("Italy")
                .selectDocument(IDENTITY_CARD, CrossDeviceIntro.class)
                .getSecureLink()
                .copyLink();

        openMobileScreen(link);
        var videoCapture = verifyPage(CrossDeviceClientIntro.class).clickContinue(DocumentVideoCapture.class);

        videoCapture.waitForCameraHint(15);
        verifyCopy(videoCapture.getErrorTitleText(), "selfie_capture.alert.camera_inactive.title");

        takePercySnapshotWithoutVideo("DocumentVideoCapture-CameraHint");
        videoCapture.dismissError();
        assertThat(videoCapture.getCameraHint()).isEmpty();

    }

    @Test(description = "should show \"Looks like you took too long error\" in ANSSI flow", groups = {"percy"})
    @Browser(enableMicrophoneCameraAccess = true)
    public void testShouldShowLooksLikeYouTookTooLongErrorInAnssiFlow() {
        uploadUkResidentPermitCrossDevice();

        var documentVideoCapture = verifyPage(CrossDeviceClientIntro.class)
                .clickContinue(DocumentVideoCapture.class)
                .clickRecordButton()
                .waitForCaptureButton()
                .clickRecordButton()
                .waitForCaptureButton()
                .waitForCameraHint(35);

        takePercySnapshotWithoutVideo("DocumentVideoCapture-tooLong");

        documentVideoCapture.clickStartAgain()
                            .clickRecordButton();

    }

    @Test(description = "should allow user to preview/retake video in ANSSI flow", groups = {"percy"})
    @Browser(enableMicrophoneCameraAccess = true)
    public void testShouldAllowUserToPreviewRetakeVideoInAnssiFlow() {
        uploadUkResidentPermitCrossDevice()
                .clickContinue(DocumentVideoCapture.class)
                .clickRecordButton()
                .waitForCaptureButton()
                .clickRecordButton()
                .waitForCaptureButton()
                .clickRecordButton();

        verifyPage(DocumentVideoConfirm.class).previewVideo()
                .retakeVideo();
    }

    @Test(description = "should allow user to go back and retake video in ANSSI flow after completing the flow", groups = {"percy"})
    @Browser(enableMicrophoneCameraAccess = true)
    public void testShouldAllowUserToGoBackAndRetakeVideoInAnssiFlowAfterCompletingTheFlow() {
        uploadUkResidentPermitCrossDevice()
                .clickContinue(DocumentVideoCapture.class)
                .clickRecordButton()
                .waitForCaptureButton()
                .clickRecordButton()
                .waitForCaptureButton()
                .clickRecordButton();

        verifyPage(DocumentVideoConfirm.class).back(DocumentVideoCapture.class)
                .clickRecordButton();
    }

    private CrossDeviceClientIntro uploadUkResidentPermitCrossDevice() {
        var link = onfido().withSteps(new DocumentStep().withRequestedVariant(VIDEO))
                .init(RestrictedDocumentSelection.class)
                .selectCountry("United Kingdom")
                .selectDocument(RESIDENT_PERMIT, CrossDeviceIntro.class)
                .getSecureLink()
                .copyLink();

        openMobileScreen(link);

        return verifyPage(CrossDeviceClientIntro.class);
    }

}
