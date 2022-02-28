package com.onfido.qa.websdk.test;

import com.onfido.qa.annotation.Browser;
import com.onfido.qa.annotation.Mobile;
import com.onfido.qa.websdk.UploadDocument;
import com.onfido.qa.websdk.page.Complete;
import com.onfido.qa.websdk.page.ConfirmUpload;
import com.onfido.qa.websdk.page.CrossDeviceIntro;
import com.onfido.qa.websdk.page.DocumentUpload;
import com.onfido.qa.websdk.page.FaceVideo;
import com.onfido.qa.websdk.page.FaceVideoIntro;
import com.onfido.qa.websdk.page.Permission;
import com.onfido.qa.websdk.page.SelfieCamera;
import com.onfido.qa.websdk.page.SelfieIntro;
import com.onfido.qa.websdk.page.SelfieUpload;
import com.onfido.qa.websdk.sdk.EnterpriseFeatures;
import com.onfido.qa.websdk.sdk.FaceStep;
import com.onfido.qa.websdk.sdk.Raw;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import static com.onfido.qa.websdk.UploadDocument.FACE;
import static com.onfido.qa.websdk.UploadDocument.LLAMA_JPG;
import static com.onfido.qa.websdk.UploadDocument.NATIONAL_IDENTITY_CARD_PDF;
import static com.onfido.qa.websdk.UploadDocument.OVER_10MB_FACE;
import static com.onfido.qa.websdk.UploadDocument.TWO_FACES;
import static com.onfido.qa.websdk.sdk.FaceStep.Variant.VIDEO;
import static org.assertj.core.api.Assertions.assertThat;

public class FaceIT extends WebSdkIT {

    public static final String BRAND_NAME = "[COMPANY/PRODUCT NAME]";

    @DataProvider
    public static Object[][] faceJpegs() {
        return new Object[][]{
                {FACE},
                {OVER_10MB_FACE}
        };
    }

    @Test(description = "should be taken to the cross device screen if browser does not have Webcam Support")
    @Browser(enableMicrophoneCameraAccess = true)
    public void testFallbackToCrossDeviceWithoutWebcamSupport() {

        onfido().withSteps(new FaceStep().withRequestedVariant(VIDEO))
                .withDisableWebcam()
                .init(CrossDeviceIntro.class);

    }

    @Test(description = "should be taken to the cross device screen if browser does not have MediaRecorder API and faceVideo variant requested")
    @Browser(enableMicrophoneCameraAccess = true)
    public void testFallbackToCrossDeviceWithoutMediaRecorderSupport() {

        onfido().withSteps(new FaceStep().withRequestedVariant(VIDEO))
                .beforeInit(this::disableMediaRecorder)
                .init(CrossDeviceIntro.class);
    }

    @Test(description = "should be taken to the selfie screen if browser does not have MediaRecorder API and faceVideo variant requested")
    @Browser(enableMicrophoneCameraAccess = true)
    @Mobile
    public void testFallbackToSelfieScreenWithoutMediaRecorderSupport() {

        onfido().withSteps(new FaceStep().withRequestedVariant(VIDEO))
                .beforeInit(this::disableMediaRecorder)
                .init(SelfieIntro.class);

    }

    @Test(description = "should return unsupported file type error for selfie")
    public void testUnsupportedFileTypeForSelfie() {
        var confirmUpload = onfido().withSteps(new FaceStep().withUseUploader(true))
                                    .init(SelfieUpload.class)
                                    .upload(NATIONAL_IDENTITY_CARD_PDF)
                                    .clickConfirmButton(ConfirmUpload.class);

        assertThat(confirmUpload.isErrorShown()).isTrue();
        verifyCopy(confirmUpload.errorTitle(), "generic.errors.unsupported_file.message");
    }


    @Test(description = "should upload selfie", dataProvider = "faceJpegs")
    public void testUploadForSelfie(UploadDocument document) {

        driver().waitFor.timeout(30);

        onfido().withSteps(new FaceStep().withUseUploader(true), "complete")
                .init(SelfieUpload.class)
                .upload(document)
                .clickConfirmButton(Complete.class);

    }

    @Test(description = "should take one selfie using the camera stream", groups = {"percy"})
    @Browser(enableMicrophoneCameraAccess = true)
    public void testSelfieUsingCameraStream() {
        var selfieIntro = onfido().withSteps(new FaceStep(), "complete")
                                  .init(SelfieIntro.class);

        takePercySnapshot("selfie-intro");

        var camera = selfieIntro.clickContinue(SelfieCamera.class);

        takePercySnapshotWithoutVideo("selfie-capture-without-video");

        assertThat(camera.onfidoFooterIsVisible()).isTrue();

        camera.record().clickConfirmButton(Complete.class);

    }

    @Test(description = "should complete the flow when snapshot is disabled")
    @Browser(enableMicrophoneCameraAccess = true)
    public void testCompleteFlowWhenSnapshotISDisabled() {
        onfido().withSteps(new FaceStep().withUseMultipleSelfieCapture(false), "complete")
                .init(SelfieIntro.class)
                .clickContinue(SelfieCamera.class)
                .record()
                .clickConfirmButton(Complete.class);
    }

    @Test(description = "should be taken to the selfie screen if browser does not have MediaRecorder API and faceVideo variant requested")
    @Mobile
    public void testSelfieScreenIfNoMediaRecorderAvailableAndFaceVideoVariantRequested() {

        onfido().withSteps(new FaceStep().withRequestedVariant(VIDEO))
                .beforeInit(this::disableMediaRecorder)
                .init(SelfieIntro.class)
                .clickContinue(Permission.class);

    }

    @Test(description = "should be taken to the cross-device flow if browser does not have MediaRecorder API, facial liveness video variant requested and photoCaptureFallback is disabled")
    public void testCrossDeviceWithoutMediaRecorder() {
        onfido().withSteps(new FaceStep().withRequestedVariant(VIDEO).withPhotoCaptureFallback(false))
                .beforeInit(this::disableMediaRecorder)
                .init(CrossDeviceIntro.class);
    }

    @Test(description = "should enter the facial liveness video flow if I have a camera and liveness video variant requested", groups = {"percy"})
    @Browser(enableMicrophoneCameraAccess = true)
    public void testFacialLivenessVideo() {
        var intro = onfido().withSteps(new FaceStep().withRequestedVariant(VIDEO))
                            .init(FaceVideoIntro.class);

        takePercySnapshot("face-video-intro");

        intro.recordVideo(FaceVideo.class);

        takePercySnapshotWithoutVideo("face-video-record");

    }

    @Test(description = "should enter the facial liveness video flow and display timeout notification after 10 seconds", groups = {"percy"})
    @Browser(enableMicrophoneCameraAccess = true)
    public void testFacialVideoTimeout() {
        var faceVideo = onfido().withSteps(new FaceStep().withRequestedVariant(VIDEO))
                                .init(FaceVideoIntro.class)
                                .recordVideo(FaceVideo.class);

        faceVideo.waitForWarningMessage(12);

        assertThat(faceVideo.isOverlayPresent()).isFalse();

        takePercySnapshotWithoutVideo("face-video-record-warning");
    }

    @Test(description = "should not show any logo, including cobrand text and logo if both showCobrand and hideOnfidoLogo are enabled for facial liveness video")
    @Browser(enableMicrophoneCameraAccess = true)
    public void testNotShowAnyLogo() {
        var enterpriseFeatures = new EnterpriseFeatures()
                .withCobrand(new EnterpriseFeatures.EnterpriseCobranding(BRAND_NAME))
                .withHideOnfidoLogo(true);

        var videoIntro = onfido().withSteps(new FaceStep().withRequestedVariant(VIDEO), "complete")
                                 .withEnterpriseFeatures(enterpriseFeatures)
                                 .init(FaceVideoIntro.class);

        assertThat(videoIntro.isLogoVisible()).isFalse();

        var faceVideo = videoIntro.recordVideo(FaceVideo.class);
        assertThat(faceVideo.isLogoVisible()).isFalse();

        var confirmUpload = faceVideo.record();
        assertThat(confirmUpload.isLogoVisible()).isFalse();

    }

    @Test(description = "should continue through full flow without problems when using customized API requests but still uploading media to API as normal")
    @Browser(enableMicrophoneCameraAccess = true)
    public void testCustomizedApi() {

        var decoupleResponse = new Raw("() => Promise.resolve({ continueWithOnfidoSubmission: true })");

        var enterpriseFeatures = new EnterpriseFeatures().withUseCustomizedApiRequests(true)
                                                         .withOnSubmitDocument(decoupleResponse)
                                                         .withOnSubmitSelfie(decoupleResponse)
                                                         .withOnSubmitVideo(decoupleResponse);

        onfido().withSteps(new FaceStep(), "complete")
                .withEnterpriseFeatures(enterpriseFeatures)
                .init(SelfieIntro.class)
                .clickContinue(SelfieCamera.class)
                .record()
                .clickConfirmButton(Complete.class);

        // TODO: we should verify, that the media is correctly uploaded
    }

    @Test(description = "should continue through full flow without problems when using customized API requests and success response is returned from callbacks")
    @Browser(enableMicrophoneCameraAccess = true)
    public void testCustomizedApiSuccess() {

        var successResponse = new Raw("() => Promise.resolve({onfidoSuccessResponse: {id: '123-456-789'}})");

        var enterpriseFeatures = new EnterpriseFeatures().withUseCustomizedApiRequests(true)
                                                         .withOnSubmitDocument(successResponse)
                                                         .withOnSubmitSelfie(successResponse)
                                                         .withOnSubmitVideo(successResponse);

        onfido().withSteps(new FaceStep(), "complete")
                .withEnterpriseFeatures(enterpriseFeatures)
                .init(SelfieIntro.class)
                .clickContinue(SelfieCamera.class)
                .record()
                .clickConfirmButton(Complete.class);
    }

    @Test(description = "should return no face found error for selfie")
    public void testShouldReturnNoFaceFoundErrorForSelfie() {
        var upload = onfido().withSteps(new FaceStep().withUseUploader(true)).init(DocumentUpload.class)
                             .upload(LLAMA_JPG)
                             .clickConfirmButton(ConfirmUpload.class);

        verifyCopy(upload.getErrorTitle(), "generic.errors.no_face.message");
    }

    @Test(description = "should return multiple faces error")
    public void testShouldReturnMultipleFacesError() {
        var upload = onfido().withSteps(new FaceStep().withUseUploader(true)).init(DocumentUpload.class)
                             .upload(TWO_FACES)
                             .clickConfirmButton(ConfirmUpload.class);

        verifyCopy(upload.getErrorTitle(), "generic.errors.multiple_faces.message");
    }

    @Test(description = "should record a video with liveness challenge, play it and submit it", groups = {"percy"})
    @Browser(enableMicrophoneCameraAccess = true)
    public void testShouldRecordAVideoWithLivenessChallengePlayItAndSubmitIt() {
        var video = onfido().withSteps(new FaceStep().withRequestedVariant(VIDEO), "complete").init(FaceVideoIntro.class)
                                .recordVideo(FaceVideo.class);

        takePercySnapshotWithoutVideo("face liveness");

        video.record();
    }

    @Test(description = "should hide the logo if using valid enterprise SDK Token and hideOnfidoLogo is enabled for facial liveness video", enabled = false)
    public void testShouldHideTheLogoIfUsingValidEnterpriseSdkTokenAndHideOnfidoLogoIsEnabledForFacialLivenessVideo() {
        /*
         * goToPassportUploadScreen(
         *         driver,
         *         welcome,
         *         documentSelector,
         *         `?language=${lang}&faceVideo=true&hideOnfidoLogo=true`
         *       )
         *       driver.executeScript(
         *         'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])'
         *       )
         *       await takePercySnapshot(
         *         driver,
         *         `Verify Submit passport photo screen does not have onfido logo ${lang}`
         *       )
         *       documentUpload.clickUploadButton()
         *       uploadFileAndClickConfirmButton(
         *         passportUploadImageGuide,
         *         confirm,
         *         'passport.jpg'
         *       )
         *       faceVideoIntro.checkLogoIsHidden()
         *       await takePercySnapshot(
         *         driver,
         *         `Verify Let’s make sure nobody’s impersonating you screen does not have onfido logo ${lang}`
         *       )
         *       faceVideoIntro.clickOnContinueButton()
         *       camera.checkLogoIsHidden()
         *       camera.enableCameraButton().click()
         *       await takePercySnapshotWithoutOverlay(
         *         driver,
         *         `Verify Position your face in the oval overlay screen does not have onfido logo ${lang}`
         *       )
         *       camera.recordButton().click()
         *       await takePercySnapshotWithoutOverlay(
         *         driver,
         *         `Movement challenge is given ${lang}`
         *       )
         *       camera.nextChallengeButton().click()
         *       await takePercySnapshotWithoutOverlay(
         *         driver,
         *         `Vocal challenge is given ${lang}`
         *       )
         *       camera.stopButton().click()
         *       confirm.checkLogoIsHidden()
         *       await takePercySnapshot(
         *         driver,
         *         `Verify Check selfie video screen does not have onfido logo ${lang}`
         *       )
         *       confirm.clickConfirmButton()
         *       verificationComplete.checkLogoIsHidden()
         *       await takePercySnapshot(
         *         driver,
         *         `Verify Verification complete screen does not have Onfido logo ${lang}`
         *       )
         */
    }

    @Test(description = "should show the cobrand text and logo if using valid enterprise SDK Token and showCobrand is enabled for facial liveness video", enabled = false)
    public void testShouldShowTheCobrandTextAndLogoIfUsingValidEnterpriseSdkTokenAndShowCobrandIsEnabledForFacialLivenessVideo() {
        /*
         * goToPassportUploadScreen(
         *         driver,
         *         welcome,
         *         documentSelector,
         *         `?language=${lang}&faceVideo=true&showCobrand=true`
         *       )
         *       driver.executeScript(
         *         'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])'
         *       )
         *       await takePercySnapshot(
         *         driver,
         *         `Verify Submit passport photo screen does has co-brand logo ${lang}`
         *       )
         *       documentUpload.clickUploadButton()
         *       uploadFileAndClickConfirmButton(
         *         passportUploadImageGuide,
         *         confirm,
         *         'passport.jpg'
         *       )
         *       faceVideoIntro.checkCobrandIsVisible()
         *       await takePercySnapshot(
         *         driver,
         *         `Verify Let’s make sure nobody’s impersonating you screen has co-brand logo ${lang}`
         *       )
         *       faceVideoIntro.clickOnContinueButton()
         *       camera.checkCobrandIsVisible()
         *       camera.enableCameraButton().click()
         *       await takePercySnapshotWithoutOverlay(
         *         driver,
         *         `Verify Position your face in the oval overlay screen has co-brand logo ${lang}`
         *       )
         *       camera.recordButton().click()
         *       camera.completeChallenges()
         *       confirm.checkCobrandIsVisible()
         *       await takePercySnapshot(
         *         driver,
         *         `Verify Check selfie video screen has co-brand logo ${lang}`
         *       )
         *       confirm.clickConfirmButton()
         *       verificationComplete.verifyUIElements()
         *       verificationComplete.checkCobrandIsVisible()
         *       // FIXME: This snapshot is currently producing a diff because flow is stuck on Confirm Upload screen
         *       //        with "Connection lost" popup error message.
         *       //        Above test passes because it is checking for a shared co-brand UI element in BasePage file.
         *       //        Adding verificationComplete.verifyUIElements(copy) check instead causes this test to fail
         *       //        as expected based on screenshot captured.
         *       await takePercySnapshot(
         *         driver,
         *         `Verify Verification complete screen has co-brand logo ${lang}`
         *       )
         */
    }
}
