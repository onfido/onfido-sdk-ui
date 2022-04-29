package com.onfido.qa.websdk.test;

import com.onfido.qa.annotation.Scenario;
import org.testng.SkipException;
import org.testng.annotations.Test;

public class ReleaseIT extends WebSdkIT {


    /*
    1. Go through the flow to face capture
      - browser should ask to enable the webcam.
    2, Accept the webcam to be used on browser
      - photo capture frame should display preview from webcam
    3. Take photo with a webcam
      - confirmation screen should show up containing photo that was taken
      - user should be able to retake or continue with taken photo
    */
    @Scenario(id = "x1", priority = "P1", feature = "Selfie capture")
    @Test(groups = {"chrome", "firefox", "safari", "edge", "SelfieCapture"}, description = "Face photo webcam capture")
    public void FacePhotoWebcamCapture() {
        /*
        On private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers
        Given webcam is connected to the computer
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Open link with additional GET parameter `?useWebcam=true`
    2. Go through the flow to document capture
       - browser should ask to enable the webcam
    3. Accept the webcam to be used on browser
       - photo capture frame should display preview from webcam
    4. Place document in front of camera so that it aligns the edges of document capture frame
       - document should be auto-captured
       - confirmation screen should show up containing a photo that was taken
       - user should be able to retake or continue with taken photo
    */
    @Scenario(id = "x2", priority = "P1", feature = "Document Capture")
    @Test(groups = {"chrome", "firefox", "safari", "edge", "DocumentCapture"}, description = "Document photo webcam auto capture")
    public void DocumentPhotoWebcamAutoCapture() {
        /*
        On private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers
        Given webcam is connected to the computer
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
    2. Click on `Get secure link` button
       - user should see a QR code below the `Scan the QR code with your phone` sub-title
       - user should also see `How to scan a QR code` help button below the QR code
    3. Clicking on `How to scan a QR code` button should display help instructions
    4. Using the mobile phone's Camera app, scan the QR code and open the link on the browser
    5. Mobile browser should load link
       - user should see `Submit passport photo page` screen with `Take photo` button
       - user should be able to upload a document from a mobile device
    */
    @Scenario(id = "x3", priority = "P1", feature = "Cross Device")
    @Test(groups = {"chrome", "safari", "android", "ios", "CrossDevice"}, description = "Cross-device with QR code")
    public void CrossDeviceWithQrCode() {
        /*
        On private mode of one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers
        Given user is on Passport page
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
    2. Click on `Get secure link` button
       - user should see options to either `Get link via SMS` or `Copy link`
    3. Click on `Copy link` option
    4. Click on `Copy` button to copy the link
    5. Open new tab and paste the copied link
       - user should see `Submit passport photo page` as the title of the screen
       - user should be able to upload a document from a mobile device
    6. Switch to the first tab
       - user should see `Connected to your mobile` screen
       - user should see an option to cancel
    7. Switch to the second tab and complete uploading the document and photo
    8. Switch to the first tab again
       - user should see `Great, that’s everything we need` screen
       - list of items uploaded should be displayed as
         - `Document uploaded`
         - `Selfie uploaded`
       - user should see the `Submit verification` button
    9. Submit verification
       - user should see `Verification complete` screen
    */
    @Scenario(id = "x4", priority = "P3", feature = "Cross Device")
    @Test(groups = {"firefox", "safari", "edge", "CrossDevice"}, description = "Cross-device with copied link")
    public void CrossDeviceWithCopiedLink() {
        /*
        On private mode of: Firefox, Safari, IE11 and Microsoft Edge browsers
        Given user is on Passport page
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Follow steps 1-6 of the test above (3a)
    2. Switch to the second tab and complete uploading the document and face video challenges
    3. Switch to the first tab again
       - user should see `Great, that’s everything we need` screen
       - list of items uploaded should be displayed as
         - `Document uploaded`
         - `Video uploaded`
       - user should see the `Submit verification` button
    4. Submit verification
       - user should see `Verification complete` screen
    */
    @Scenario(id = "x5", priority = "P1", feature = "Cross Device")
    @Test(groups = {"chrome", "firefox", "CrossDevice"}, description = "Cross-device with copied link (with Face video)")
    public void CrossDeviceWithCopiedLinkWithFaceVideo() {
        /*
        On private mode of: Google Chrome, Firefox browsers
        Given user is on Passport page and link is opened with additional GET parameter `?faceVideo=true`
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Click on `Continuar en el teléfono` button to start cross-device flow
       - user should see `Continúe en su teléfono móvil` screen
       - user should be able to continue to next screen and have the options for SMS and copy link
    2. Click on `Obtener link via mensage de texto` option button
       - user should be able to provide mobile number from any country
       - user should now see the options to switch to QR code or copy link at the bottom
    3. Type valid mobile number connected to mobile test device and send
       - user should see `Controle su dispositivo móvil` screen
       - user should see option to resend link
       - user should receive SMS on a mobile device
       - the body of the SMS should be in Spanish
    4. Open link on mobile device (for each mobile browser)
       - user should see that the SDK is in Spanish
    */
    @Scenario(id = "x7", priority = "P1", feature = "Cross Device")
    @Test(groups = {"chrome", "safari", "android", "ios", "CrossDevice"}, description = "Cross-device with SMS in Spanish")
    public void CrossDeviceWithSmsInSpanish() {
        /*
        On private mode of one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers
        Given user is using the Spanish SDK by opening the link with additional GET parameter `?language=es`
        And is on upload document page on desktop browser
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Click on the `Copy` button
    2. Open a new tab of the browser
    3. Paste the link
       - user should see `Something's gone wrong` message
       - user should see `You must open this link on a mobile device` message
       - user should see the icon with the phone, screen and the red cross
    */
    @Scenario(id = "x9", priority = "P1", feature = "Cross Device")
    @Test(groups = {"chrome", "firefox", "safari", "edge", "CrossDevice"}, description = "Prevent opening cross-device URL on web browsers")
    public void PreventOpeningCrossDeviceUrlOnWebBrowsers() {
        /*
        On private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers
        Given user is on first page of cross-device flow
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Go through the flow for document capture
    2. Upload the ID documents in the browser
    3. On the next step you should see the cross device introduction screen
    4. Choose to continue on your phone by clicking on ‘Get secure link’ button
    5. Open the cross device link on a mobile device with media recorder API support (Chrome on iOS or Android)
       - user should be taken to the selfie intro screen
    6. Complete the selfie capture and return to the desktop browser
    7. Click on ‘Submit verification’ button to complete the flow
    8. The `Complete` screen should be displayed
       - With the browser's Developer Tools (View > Developer > Developer Tools in Chrome desktop browser), check that you see a message that reads "Complete with data!" in the Console tab
       - There should be no error in the Console tab that reads "onError callback" and/or "'The following keys have missing data: document_front'"
    */
    @Scenario(id = "x10", priority = "P1", feature = "Cross Device")
    @Test(groups = {"chrome", "firefox", "CrossDevice"}, description = "Flow can be completed when transitioning to cross device on the selfie capture step")
    public void FlowCanBeCompletedWhenTransitioningToCrossDeviceOnTheSelfieCaptureStep() {
        /*
        On private mode of: Google Chrome, Firefox
        Given webcam is not connected to the computer
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Open link with additional GET parameter `?faceVideo=true`
    2. Upload the ID documents in the browser
    3. On the face video recording screen, wait for the `Check that it is connected and functional. You can also continue verification on your phone` message and select it
    4. Open the cross device link on a mobile device that doesn't have media recorder API support (Chrome on iOS)
       - user should be taken to the selfie intro screen
    5. Open the cross device link on a mobile device that has media recorder API support (Chrome on Android)
       - user should be taken to the liveness intro screen
    6. Complete the liveness video challenges

    */
    @Scenario(id = "x11", priority = "P3", feature = "Cross Device")
    @Test(groups = {"chrome", "firefox", "CrossDevice"}, description = "Cross device transition between browsers with different face video support")
    public void CrossDeviceTransitionBetweenBrowsersWithDifferentFaceVideoSupport() {
        /*
        On private mode of: Google Chrome, Firefox
        Given webcam is connected to the computer
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Open link with additional GET parameter `?faceVideo=true`
    2. Upload the ID documents in the browser
    3. Open the cross device link on a mobile device that doesn't have media recorder API support (Chrome on iOS)
       - user should be taken to the selfie intro screen
    4. Open the cross device link on a mobile device that has media recorder API support (Chrome on Android)
       - user should be taken to the liveness intro screen
    5. Complete the liveness video challenges
    */
    @Scenario(id = "x12", priority = "P2", feature = "Cross Device")
    @Test(groups = {"CrossDevice"}, description = "Cross device transition between browsers with different face video support - without webcam")
    public void CrossDeviceTransitionBetweenBrowsersWithDifferentFaceVideoSupportWithoutWebcam() {
        /*
        Given webcam is not connected to the computer
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Select `passport` document
       - everything should be displayed properly and layout should not be broken
    2. Upload document
       - everything should be displayed properly and layout should not be broken
    3. Upload face photo
       - everything should be displayed properly and layout should not be broken
    */
    @Scenario(id = "x13", priority = "P1", feature = "Upload Document")
    @Test(groups = {"firefox", "safari", "edge", "UploadDocument"}, description = "Check happy path flow for passports on other desktop browsers")
    public void CheckHappyPathFlowForPassportsOnOtherDesktopBrowsers() {
        /*
        On private mode of: Safari, Firefox, IE11 and Microsoft Edge browsers
        Go through the flow looking for layout/usability inconsistencies between browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Select either `driver's license` or `identity card` document
       - everything should be displayed properly and layout should not be broken
    2. Type "de" in the text input below `Search for country`
       - everything should be displayed properly and layout should not be broken
       - there should be a dropdown list with the following countries displayed in the dropdown options:
         - Bangladesh, Denmark, Russia Federation, Sweden for `driver's license`
         - Bangladesh, Russia Federation, Sweden for `identity card`
    3. Select a country from the list
    4. Click on `Submit document`
    5. Upload document
       - everything should be displayed properly and layout should not be broken
    6. Upload face photo
       - everything should be displayed properly and layout should not be broken
    */
    @Scenario(id = "x14", priority = "P1", feature = "Upload Document")
    @Test(groups = {"firefox", "safari", "edge", "UploadDocument"}, description = "Check happy path flow for other document types on other desktop browsers")
    public void CheckHappyPathFlowForOtherDocumentTypesOnOtherDesktopBrowsers() {
        /*
        On private mode of: Safari, Firefox, IE11 and Microsoft Edge browsers
        Go through the flow looking for layout/usability inconsistencies between browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Select `passport` document
       - everything should be displayed properly and layout should not be broken
    2. Upload document
       - everything should be displayed properly and layout should not be broken
    3. Upload face photo
       - everything should be displayed properly and layout should not be broken
    */
    @Scenario(id = "x15", priority = "P2", feature = "Upload Document")
    @Test(groups = {"chrome", "safari", "android", "ios", "UploadDocument"}, description = "Check happy path flow for passports on mobile browsers")
    public void CheckHappyPathFlowForPassportsOnMobileBrowsers() {
        /*
        On private mode of: Android Google Chrome and iOS Safari browsers
        Go through the flow looking for layout/usability inconsistencies between browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Select either `driver's license` or `identity card` document
       - everything should be displayed properly and layout should not be broken
    2. Type "de" in the text input below `Search for country`
       - everything should be displayed properly and layout should not be broken
       - there should be a dropdown list with at least 1 country displayed
    3. Select a country from the list
    4. Click on `Submit document`
    5. Upload document
       - everything should be displayed properly and layout should not be broken
    6. Upload face photo
       - everything should be displayed properly and layout should not be broken
    */
    @Scenario(id = "x16", priority = "P2", feature = "Upload Document")
    @Test(groups = {"firefox", "safari", "edge", "UploadDocument"}, description = "Check happy path flow for other document types on other desktop browsers")
    public void CheckHappyPathFlowForOtherDocumentTypesOnOtherDesktopBrowsers2() {
        /*
        On private mode of: Safari, Firefox, IE11 and Microsoft Edge browsers
        Go through the flow looking for layout/usability inconsistencies between browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Go to the face step
    2. Move your face to the left
       - Make sure your face also moves to the left on camera feed (like looking at a mirror)
    */
    @Scenario(id = "x17", priority = "P3", feature = "Selfie capture")
    @Test(groups = {"android", "ios", "SelfieCapture"}, description = "Check the camera is mirroring")
    public void CheckTheCameraIsMirroring() {
        /*
        ONLY ON browsers with getUserMedia support: on an iOS and Android device; a laptop with camera; desktop or laptop with a third-party USB camera
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Go to the face step. If on desktop resize the window to less than 480px width wise (if the browser let's you reduce that far)
    2. The capture component should be fullscreen
    */
    @Scenario(id = "x18", priority = "P3", feature = "Selfie capture")
    @Test(groups = {"android", "ios", "SelfieCapture"}, description = "Check the camera is fullscreen on mobile devices/small screens")
    public void CheckTheCameraIsFullscreenOnMobileDevicessmallScreens() {
        /*
        ONLY ON browsers with getUserMedia support: on an iOS and Android device; a laptop with camera; desktop or laptop with a third-party USB camera
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. On private mode of a browser that has getUserMedia support, go to the face step
    2. User should see a browser notification asking to Allow or Block camera permission
       - Button should appear disabled (darkened out)
       - Click on the camera button
       - Nothing should happen, user does not proceed to next step
    3. Click on browser notification to Allow camera permission
       - Button should become enabled (no longer darkened out)
       - Click on the camera button
       - User proceeds to next step with preview of photo taken
    */
    @Scenario(id = "x19", priority = "P2", feature = "Selfie capture")
    @Test(groups = {"android", "ios", "SelfieCapture"}, description = "Check camera button cannot be clicked until camera permission is granted")
    public void CheckCameraButtonCannotBeClickedUntilCameraPermissionIsGranted() {
        /*
        ONLY ON browsers with getUserMedia support: on an iOS and Android device; a laptop with camera; desktop or laptop with a third-party USB camera
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Replace VERSION with the actual version from the SUT in the link `https://jsfiddle.net/gh/get/library/pure/onfido/onfido-sdk-ui/tree/VERSION/demo/fiddle/` and access it
    2. Add the following options to the `Onfido.init` initialisation params:
    `
    language: {
        locale: 'fr',
        phrases: {'welcome.title': 'Ouvrez votre nouveau compte bancaire'}
    }
    `

    3. Then the title on the welcome screen should be 'Ouvrez votre nouveau compte bancaire'
    */
    @Scenario(id = "x20", priority = "P1", feature = "String Customization")
    @Test(groups = {"StringCustomization"}, description = "Check that custom strings can be passed")
    public void CheckThatCustomStringsCanBePassed() {
        /*
        on any browser
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Replace VERSION with the actual version from the SUT in the link `https://jsfiddle.net/gh/get/library/pure/onfido/onfido-sdk-ui/tree/VERSION/demo/fiddle/` and access it
    2. Add the following options to the `Onfido.init` initialisation params:
    `
    language: {
        locale: 'es',
        phrases: {'welcome.title': 'A custom string'}
    }
    `

    3. Then the title on the welcome screen should be 'A custom string'
    4. All the other strings should be in Spanish
    */
    @Scenario(id = "x21", priority = "P3", feature = "String Customization")
    @Test(groups = {"StringCustomization"}, description = "Overriding strings for a supported language")
    public void OverridingStringsForASupportedLanguage() {
        /*
        on any browser
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Replace VERSION with the actual version from the SUT in the link `https://jsfiddle.net/gh/get/library/pure/onfido/onfido-sdk-ui/tree/VERSION/demo/fiddle/` and access it
    2. Add the following options to the `Onfido.init` initialisation params:

    `
    language: {
        locale: 'es',
        mobilePhrases: {'capture.passport.front.title': 'A custom string'}
    }
    `

    3. Select passport on the document selector screen
    4. Choose the cross device flow and send an SMS to your mobile
    5. The SMS should be in Spanish
    6. When you open the link on your mobile device, the title on the cross device client should be `A custom string`
    7. All the other strings should be in Spanish
    */
    @Scenario(id = "x22", priority = "P2", feature = "String Customization")
    @Test(groups = {"StringCustomization"}, description = "Overriding strings for a supported language on mobile")
    public void OverridingStringsForASupportedLanguageOnMobile() {
        /*
        on any browser
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Go through the flow to document capture
    2. Upload a document in PDF format
    3. You should see a confirm screen with the following outcomes

    Outcome:

    - on Safari (and Chrome - this is automated) you should see a preview of the PDF
    - on Firefox, IE11, Microsoft Edge and mobile browsers you should see an icon of a PDF
    */
    @Scenario(id = "x23", priority = "P1", feature = "PDF Upload")
    @Test(groups = {"firefox", "safari", "edge", "PdfUpload"}, description = "Upload a document in PDF format")
    public void UploadADocumentInPdfFormat() {
        /*
        _Feature is available on desktop browsers only._
        on Firefox, Safari, IE11 and Microsoft Edge browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Replace VERSION with the actual version from the SUT in the link `https://jsfiddle.net/gh/get/library/pure/onfido/onfido-sdk-ui/tree/VERSION/demo/fiddle/` and access it
    2. Add the following options to the initialisation params:

    `
    {
      "steps": [
        "welcome",
        {
          "type": "document",
          "options": {
            "documentTypes": {
              "passport": true,
              "driving_licence": true
            }
          }
        },
        "face",
        "complete"
      ]
    }
    `

    Outcome:
    - On the document selection screen only "Passport" and "Driver's License" options should be visible.
    */
    @Scenario(id = "x24", priority = "P1", feature = "Document Capture")
    @Test(groups = {"DocumentCapture"}, description = "Overriding the document options")
    public void OverridingTheDocumentOptions() {

        throw new SkipException("Not implemented");
    }


    /*
    1. Go through the flow to document capture
    2. Upload a valid document
    3. Click `Confirm`
    4. You should see a permission priming screen
    5. Click `Enable webcam`
    6. You should see the capture screen and camera permissions prompt
    */
    @Scenario(id = "x25", priority = "P1", feature = "Permission")
    @Test(groups = {"firefox", "safari", "edge", "Permission"}, description = "Check permission priming screen displays when webcam is available and permission was not yet granted")
    public void CheckPermissionPrimingScreenDisplaysWhenWebcamIsAvailableAndPermissionWasNotYetGranted() {
        /*
        On Firefox, Safari and Microsoft Edge browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Go through the flow to document capture
    2. Upload a valid document
    3. Click `Confirm`
    4. You should see the capture screen
    */
    @Scenario(id = "x26", priority = "P1", feature = "Permission")
    @Test(groups = {"chrome", "Permission"}, description = "Check permission priming screen does not display when webcam is available and permission was already granted")
    public void CheckPermissionPrimingScreenDoesNotDisplayWhenWebcamIsAvailableAndPermissionWasAlreadyGranted() {
        /*
        On Chrome
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Go through the flow to document capture
    2. Upload a valid document
    3. Click `Confirm`
    4. You should see a permission priming screen
    5. Click `Enable webcam`
    6. You should see the capture screen and camera permissions prompt
    7. Click `Block`
    8. You should see the permission denied / recovery screen
    */
    @Scenario(id = "x27", priority = "P1", feature = "Permission")
    @Test(groups = {"chrome", "Permission"}, description = "Check permission denied / recovery screen displays when webcam is available and permission wasn't previously denied and is denied after prompt")
    public void CheckPermissionDeniedRecoveryScreenDisplaysWhenWebcamIsAvailableAndPermissionWasntPreviouslyDeniedAndIsDeniedAfterPrompt() {
        /*
        On Chrome
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Go through the flow to document capture
    2. Upload a valid document
    3. Click `Confirm`
    4. You should see a permission priming screen
    5. Click `Enable webcam`
    6. You should see the permission denied / recovery screen if the browser does not remember previous decision
    */
    @Scenario(id = "x28", priority = "P1", feature = "Permission")
    @Test(groups = {"firefox", "safari", "edge", "Permission"}, description = "Check permission denied / recovery screen displays when webcam is available and permission was previously denied")
    public void CheckPermissionDeniedRecoveryScreenDisplaysWhenWebcamIsAvailableAndPermissionWasPreviouslyDenied() {
        /*
        On Firefox, Safari and Microsoft Edge browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Go through the flow to face capture
       - browser should ask to enable the webcam
    2. Accept the webcam to be used on browser
       - photo capture frame should display preview from webcam
    3. Wait for 10 seconds
       - A warning should pop up with "Use your mobile" link
    4. Click on "Use your mobile"
       - You should be able to continue on mobile
    */
    @Scenario(id = "x29", priority = "P2", feature = "Selfie capture")
    @Test(groups = {"chrome", "firefox", "safari", "edge", "SelfieCapture"}, description = "Live face capture fallback on Desktop")
    public void LiveFaceCaptureFallbackOnDesktop() {
        /*
        On private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers
        Given webcam is connected to the computer
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Go through the flow to face capture
       - browser should ask to enable the camera
    2. Accept the camera to be used on browser
       - photo capture frame should display preview from camera
    3. Wait for 8 seconds
       - A warning should pop up asking if you are having problems with the camera
    4. Click on "Try the basic camera mode instead"
       - You should be able to take a picture with your native camera
    */
    @Scenario(id = "x30", priority = "P2", feature = "Selfie capture")
    @Test(groups = {"chrome", "safari", "android", "ios", "SelfieCapture"}, description = "Live face capture fallback on mobile")
    public void LiveFaceCaptureFallbackOnMobile() {
        /*
        On private mode of getUsermedia supported browser: latest Google Chrome on Android and Safari on iOS11+
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Open link with additional GET parameter `?faceVideo=true`
    2. Go through the flow to face capture
    3. You should see an intro screen with header "Let’s make sure nobody’s impersonating you"
       - Click "Continue"
       - browser should ask to enable the webcam
    4. Accept the webcam to be used on browser
       - video capture frame should display preview from webcam
    5. Take a video with a webcam
       - click on the camera button
       - follow the instructions on the screen
       - you should see 2 challenges
       - once completed, you should be able to see the video and to click on "Confirm"
       - you should see the complete screen
    */
    @Scenario(id = "x31", priority = "P1", feature = "Selfie Video capture")
    @Test(groups = {"chrome", "firefox", "safari", "SelfieVideoCapture"}, description = "Face video on desktop with webcam")
    public void FaceVideoOnDesktopWithWebcam() {
        /*
        On private mode of: Google Chrome and Firefox browsers and Safari 14+
        Given webcam is connected to the computer
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Open link with additional GET parameter `?faceVideo=true`
    2. Go through the flow to face capture
    3. You should see a screen that guides you to use your mobile
       - Copy the link
       - Open the link in a new tab
    4. You should see a file uploader to upload a selfie
       - Upload selfie
       - Confirm
    */
    @Scenario(id = "x32", priority = "P2", feature = "Selfie Video capture")
    @Test(groups = {"safari", "edge", "SelfieVideoCapture"}, description = "Face video on desktop with webcam - Old Browsers")
    public void FaceVideoOnDesktopWithWebcamOldBrowsers() {
        /*
        On private mode of: Safari (older than Safari 14) and older Edge browsers (EdgeHTML) - these browsers do not support video recording
        Given webcam is connected to the computer
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Open link with additional GET parameter `?faceVideo=true`
    2. Go through the flow to face capture
    3. You should see a screen that guides you to use your mobile - Input mobile number - Send SMS - Click on link on your mobile - Accept camera permissions
       On Android:
       4a. You should see a camera screen - You should be able to submit a video
       On iOS:
       4b. You should see a file uploader to upload a selfie - Upload selfie - Confirm
    */
    @Scenario(id = "x33", priority = "P1", feature = "Selfie Video capture")
    @Test(groups = {"safari", "SelfieVideoCapture"}, description = "Face video on desktop with no video support or no webcam")
    public void FaceVideoOnDesktopWithNoVideoSupportOrNoWebcam() {
        /*
        On private mode of: any browser with no webcam OR Safari versions older than 14 and IE11 browsers
        Given there is NO webcam connected to the computer
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Replace VERSION with the actual version from the SUT in the link `https://jsfiddle.net/gh/get/library/pure/onfido/onfido-sdk-ui/tree/VERSION/demo/fiddle/` and access it
    2. Add the following options to the `Onfido.init` initialisation params:

    ```json
    {
      "steps": [
        "welcome",
        {
          "type": "face",
          "options": {
            "requestedVariant": "video"
          }
        },
        "complete"
      ]
    }
    ```

    3. You should see a screen that guides you to use your mobile - Input mobile number - Send SMS - Click on link on your mobile - Accept camera permissions
    On Android:
       4a. You should see a camera screen - You should be able to submit a video
    On iOS:
       4b. You should see a file uploader to upload a selfie - Upload selfie - Confirm
    */
    @Scenario(id = "x34", priority = "P2", feature = "Selfie Video capture")
    @Test(groups = {"SelfieVideoCapture"}, description = "Face video on desktop with no video support or no webcam when integrator sets `requestedVariant: 'video'`")
    public void FaceVideoOnDesktopWithNoVideoSupportOrNoWebcamWhenIntegratorSetsRequestedvariantVideo() {

        throw new SkipException("Not implemented");
    }


    /*
    1. Open link with additional GET parameter `?countryCode=US`
    2. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
       - user should be able to continue to next screen and provide mobile number from any country
       - user should see the option to send SMS
       - the SMS input flag should be the US flag
    */
    @Scenario(id = "x35", priority = "P3", feature = "Cross Device")
    @Test(groups = {"CrossDevice"}, description = "Custom SMS country code and flag")
    public void CustomSmsCountryCodeAndFlag() {
        /*
        On one of the desktop browsers
        Given there is no webcam connected to the computer
        */

        throw new SkipException("Not implemented");
    }


    /*
    Given there is no webcam connected to the computer

    1. Open link with additional GET parameter `?countryCode=ABCD`
    2. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
       - user should be able to continue to next screen and provide mobile number from any country
       - user should see the option to send SMS
       - the SMS input flag should be the UK one
    */
    @Scenario(id = "x36", priority = "P2", feature = "Cross Device")
    @Test(groups = {"CrossDevice"}, description = "Custom SMS with invalid country code")
    public void CustomSmsWithInvalidCountryCode() {
        /*
        on one of the desktop browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    Given user opened the link with `?uploadFallback=false` flag

    1. And user is on first page of cross-device flow
    2. Open the cross device link on mobile browsers with a working webcam
       - user should be able to complete the cross-device flow successfully
    */
    @Scenario(id = "x37", priority = "P2", feature = "Prevent upload flag")
    @Test(groups = {"PreventUploadFlag"}, description = "Prevent upload fallback redirect to cross-device")
    public void PreventUploadFallbackRedirectToCrossDevice() {

        throw new SkipException("Not implemented");
    }


    /*
    Given user opened the link with `?uploadFallback=false` flag

    1. And user is on first page of cross-device flow
    2. Open the cross device link on mobile browsers with a malfunctioning camera or on mobile browsers that do not support getUserMedia (i.e. Safari on iOS10.3 or earlier, Chrome on iOS)
       - user won't see the "use the native camera mode instead" link
       - user should see `Unsupported browser` message
       - user should see `Restart the process on the latest version of Safari/Chrome` message
       - user should NOT be able to complete the cross-device flow successfully.
    */
    @Scenario(id = "x38", priority = "P1", feature = "Prevent upload flag")
    @Test(groups = {"PreventUploadFlag"}, description = "Prevent upload fallback redirect with camera unavailable")
    public void PreventUploadFallbackRedirectWithCameraUnavailable() {

        throw new SkipException("Not implemented");
    }


    /*
    Given user opened the link with `?uploadFallback=false` flag

    1. And user is on first page of cross-device flow
    2. Open the cross device link on mobile browser without a camera
       - user should not be able to upload documents
       - user should not be able to record the face video
       - user should see `Unsupported browser` message
       - user should see `Restart the process on the latest version of Safari/Chrome` message
       - user should see the icon with the phone, screen and the red cross
    */
    @Scenario(id = "x39", priority = "P2", feature = "Prevent upload flag")
    @Test(groups = {"PreventUploadFlag"}, description = "Prevent upload fallback redirect to browser without camera")
    public void PreventUploadFallbackRedirectToBrowserWithoutCamera() {

        throw new SkipException("Not implemented");
    }


    /*
    1. Open link with additional GET parameter `?smsNumber=+447955555555`
    2. Go to the document capture step
    3. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
       - user should see that the SMS input has been pre-filled with the number provided at the beginning
       - if the number is correct the user should be able to successfully send an SMS
       - if the number is invalid the user will see an error when clicking "Send link"
    */
    @Scenario(id = "x40", priority = "P3", feature = "Cross Device")
    @Test(groups = {"CrossDevice"}, description = "Custom SMS number")
    public void CustomSmsNumber() {
        /*
        On one of the desktop browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Upload a document
    2. Click "Enlarge image"
    3. Click browser's back button while document is zoomed in
       - "Check your image" text and back arrow retain the colour
       - Back navigation in the browser doesn't cause any other UI changes in the SDK
    */
    @Scenario(id = "x41", priority = "P3", feature = "Upload Document")
    @Test(groups = {"UploadDocument"}, description = "Browse back after enlarging the document")
    public void BrowseBackAfterEnlargingTheDocument() {
        /*
        Desktop and mobile browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Open link with additional GET parameter `?useLiveDocumentCapture=true`
    2. Go through the document capture flow
       - browser should ask to allow camera access
    3. Allow the device's camera to be used on the browser
       - photo capture frame should display preview from the device's back facing camera
    4. Place document in front of camera so that it aligns the edges of document capture frame
    5. Take photo of the document with the back facing camera
       - document should be captured
       - loading screen might be visible if taking a long time
       - confirmation screen should eventually show up containing photo that was taken
       - user should be able to retake or continue with that photo
    */
    @Scenario(id = "x42", priority = "P1", feature = "Live Document Capture")
    @Test(groups = {"chrome", "safari", "android", "ios", "LiveDocumentCapture"}, description = "Check happy path flow of live document capture on mobile devices with media recorder API support")
    public void CheckHappyPathFlowOfLiveDocumentCaptureOnMobileDevicesWithMediaRecorderApiSupport() {
        /*
        on private mode of both Android Chrome and Safari on iOS11+ mobile browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Open link with additional GET parameter `?useLiveDocumentCapture=true&uploadFallback=true`
    2. Go through the flow to document capture
       - browser should ask to enable the camera
    3. Accept the camera to be used on browser
       - photo capture frame should display preview from camera
    4. Wait for 10 seconds
       - A warning should pop up asking if you are having problems with the camera
    5. Click on "Try the basic camera mode instead"
       - You should be able to take a picture with your native camera
    */
    @Scenario(id = "x43", priority = "P2", feature = "Live Document Capture")
    @Test(groups = {"chrome", "safari", "android", "ios", "LiveDocumentCapture"}, description = "Live document capture fallback on mobile")
    public void LiveDocumentCaptureFallbackOnMobile() {
        /*
        on private mode of Google Chrome on Android and Safari on iOS11+
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Open link with additional GET parameter `?useLiveDocumentCapture=true`
    2. Go through the flow to document capture
       - browser should ask to enable the camera
    3. Accept the camera to be used on browser
       - photo capture frame should display preview from camera
    4. Wait for 10 seconds
       - A warning should pop up asking if you are having problems with the camera
    5. Click on "continue verification on your phone"
       - You should be able to switch to the cross device flow and use a mobile device to capture a document
    */
    @Scenario(id = "x44", priority = "P2", feature = "Live Document Capture")
    @Test(groups = {"LiveDocumentCapture"}, description = "Live document capture fallback on Hybrid")
    public void LiveDocumentCaptureFallbackOnHybrid() {
        /*
        private mode for browsers on Microsoft Surface or other hybrid device
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Open link with additional GET parameter `?useLiveDocumentCapture=true`
    2. Go through the flow to document capture
       - browser should ask to enable the camera
    3. Accept the camera to be used on browser
       - photo capture frame should display preview from camera
       - camera should be rear/environment facing
    */
    @Scenario(id = "x45", priority = "P1", feature = "Live Document Capture")
    @Test(groups = {"LiveDocumentCapture"}, description = "Live document capture facingMode: {exact: \"environment\"} constraint")
    public void LiveDocumentCaptureFacingmodeExactEnvironmentConstraint() {
        /*
        private mode for mobile browsers, browsers on Ipad, and browsers on Microsoft Surface or other hybrid device
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Open link with additional GET parameter `?useLiveDocumentCapture=true`
    2. Go through the flow to document capture
       - browser should disregard the request for live document capture
       - browser should direct to the normal desktop flow options of cross device or document upload
    */
    @Scenario(id = "x46", priority = "P2", feature = "Live Document Capture")
    @Test(groups = {"LiveDocumentCapture"}, description = "Live document capture attempt on non hybrid desktop")
    public void LiveDocumentCaptureAttemptOnNonHybridDesktop() {
        /*
        private mode for desktop browsers, not on Surface or other hybrid device, OR if on hybrid device, with rear camera disabled through device manager
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Open link with additional GET parameter `?showUserConsent=true`
    2. Continue to the next step
       - You should see a consent screen with a list of FAQs
       - When clicking on the links inside the screen content, they should open in a new tab
    3. Click on "Accept"
       - You should see the document selector screen
    4. Click on the back button
       - You should see the consent screen again
    5. Click on "Do not accept"
       - You should see a modal with the title "Are you sure?"
    6. Click on "Review again"
       - The modal should disappear
    7. Click on "Do not accept"
       - You should see a modal with the title "Are you sure?"
    8. Click on "Yes, don't verify me"
       - The SDK should disappear and the flow will be over
    */
    @Scenario(id = "x47", priority = "OOS", feature = "Consent screen")
    @Test(groups = {"ConsentScreen"}, description = "User Consent screen")
    public void UserConsentScreen() {
        /*
        on private mode on desktop and mobile browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Open link with additional GET parameter `?showUserConsent=true&useModal=true`
    2. The SDK will open inside a modal.
    3. Continue to the next step
       - You should see a consent screen with a list of FAQs
       - When clicking on the links inside the screen content, they should open in a new tab
    4. Click on "Accept"
       - You should see the document selector screen
    5. Click on the back button
       - You should see the consent screen again
    6. Click on "Do not accept"
       - You should see a modal with the title "Are you sure?"
    7. Click on "Review again"
       - The modal should disappear
    8. Click on "Do not accept"
       - You should see a modal with the title "Are you sure?"
    9. Click on "Yes, don't verify me"
       - The SDK should disappear and the flow will be over
    */
    @Scenario(id = "x48", priority = "OOS", feature = "Consent screen")
    @Test(groups = {"ConsentScreen"}, description = "User Consent screen inside a modal")
    public void UserConsentScreenInsideAModal() {
        /*
        on private mode on desktop and mobile browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Open link with additional GET parameter `?showUserConsent=true`
    2. Disconnect from your internet connection
       - On desktop, either turn off your Wifi or disconnect from your wired connection.
       - On mobile devices, switch to Airplane mode.
    3. Continue to the next step
    4. You should see `Content failed to load` screen
    5. Reconnect to your intenet connection
       - On desktop, either turn on your Wifi or reconnect to your wired connection.
       - On mobile devices, switch to Airplane mode.
    6. Click on `Reload screen` button
       - You should see a consent screen with a list of FAQs
       - When clicking on the links inside the screen content, they should open in a new tab
    7. Click on "Accept"
       - You should see the document selector screen
    8. You should be able to complete the ID verification flow successfully
    */
    @Scenario(id = "x49", priority = "OOS", feature = "Consent screen")
    @Test(groups = {"ConsentScreen"}, description = "User Consent screen can be reloaded if it failed to load due to loss of connection")
    public void UserConsentScreenCanBeReloadedIfItFailedToLoadDueToLossOfConnection() {
        /*
        on private mode on desktop and mobile browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. And user is on first page of cross-device flow
    2. Open the cross device link on mobile browsers that don't support MediaRecorder (i.e. Safari on iOS13.7 or earlier):
       - user won't see the "use the native camera mode instead" link
       - user should see `Unsupported browser` message
       - user should see `Restart the process on the latest version of Safari/Chrome` message
       - user should NOT be able to complete the cross-device flow successfully.
    */
    @Scenario(id = "x50", priority = "P2", feature = "Selfie capture")
    @Test(groups = {"SelfieCapture"}, description = "Interrupt flow if selfie fallback is deactivated and MediaRecorder is not supported")
    public void InterruptFlowIfSelfieFallbackIsDeactivatedAndMediarecorderIsNotSupported() {
        /*
        Given user opened the link with `?faceVideo=true&photoCaptureFallback=false` flags
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Before launching the TestApp, go to Settings - (some iOS versions - General) - Accessibility - Larger text/Display & Text Size
    2. Turn ON `Larger Text` option
    3. Set text size picker to the largest one
    4. Open the test link on Chrome or Safari on mobile device
    5. Make sure:
       - All the screens reflect the changes applied in the Settings
       - If the whole text is not visible, you should have the possibility to scroll through the screen and be able to read the whole text
       - None of the strings is cut off
    */
    @Scenario(id = "x51", priority = "P2", feature = "Dynamic font size.")
    @Test(groups = {"DynamicFontSize"}, description = "Dynamic font size on iOS devices")
    public void DynamicFontSizeOnIosDevices() {
        throw new SkipException("Not implemented");
    }


    /*
    1. Before launching the TestApp, go to Settings and find the option within the Accessibility section for Font size. Location of such settings varies across the device models.
    2. Set text size picker to the largest one
    3. Open the test link on Chrome mobile browser
    4. Make sure:
       - All the screens reflect the changes applied in the Settings
       - If the whole text is not visible, you should have the possibility to scroll through the screen and be able to read the whole text
       - None of the strings is cut off
    */
    @Scenario(id = "x52", priority = "P2", feature = "Dynamic font size.")
    @Test(groups = {"DynamicFontSize"}, description = "Dynamic font size on Android devices")
    public void DynamicFontSizeOnAndroidDevices() {


        throw new SkipException("Not implemented");
    }


    /*
    1. Go to Settings - (some iOS versions - General) - Accessibility - VoiceOver
    2. Turn ON VoiceOver option
    3. Open the test link on Chrome or Safari on mobile device
    4. Make sure:
       - When you run the flow the first item VoiceOver will focus on screen heading
       - When you transition to the next screen, the the first item VoiceOver will focus on screen heading
       - You are able to swipe back and forward on any strings and buttons
       - The strings are read properly
       - Once VoiceOver hovers over the button it will ready “button” word at the end
       - After navigating to next screen, the screen heading is announced e.g “Choose your document” or “Select issuing country”
       - While capturing the document the capture warnings are announced e.g. Glare is detected
       - You can complete document+selfie and document+video flows with VoiceOver
    */
    @Scenario(id = "x53", priority = "P2", feature = "Voice-Over")
    @Test(groups = {"VoiceOver"}, description = "Screen reader on iOS devices - VoiceOver")
    public void ScreenReaderOnIosDevicesVoiceover() {
        /*
        Quick guide how to use VoiceOver - https://youtu.be/qDm7GiKra28
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Go to Settings and find the Accessibility section. Inside the the Accessibility section there should be TalkBack
    2. Turn ON TalkBack
    3. Open the test link on Chrome or Safari on mobile device
    4. Make sure:
       - When you run the flow the first item TalkBack will focus on screen heading
       - When you transition to the next screen, the the first item TalkBack will focus on screen heading
       - You are able to swipe back and forward on any strings and buttons
       - The strings are read properly
       - Once TalkBack hovers over the button it will ready “button” word at the end
       - After navigating to next screen, the screen is announced e.g “Choose your document” or “Select issuing country”
       - While capturing the document the capture warnings are announced e.g. Glare is detected
       - You can complete document+selfie and document+video flows with TalkBack
    */
    @Scenario(id = "x54", priority = "P2", feature = "Voice-Over")
    @Test(groups = {"VoiceOver"}, description = "Screen reader on Android devices - TalkBack")
    public void ScreenReaderOnAndroidDevicesTalkback() {
        /*
        Quick guide how to use TalkBack - https://youtu.be/YJSWYLZD8EI
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Start the proof of address verification. To include Proof of Address flow step, there are two options:
        - Add ?poa=true to the end of the url. Using this option, the flow will be composed of: PoA + Doc + Face. E.g: https://latest-onfido-sdk-ui-onfido.surge.sh/?poa=true.
        - On the Developer Tools > Console, run onfidoSdkHandle.setOptions({steps: [{type: 'poa'}]}). This will run the flow with PoA as the only step.
    2. Advance to Country Select Screen
        - choose a country from the list
    3. Advance to document submission
        - if the country selected was the UK: accepted document types are Bank or building society statement, Utility bill, Council tax letter and Benefits letter
        - if the country selected was not the UK: accepted document types are Bank statement and Utility bill
    4. Pick one of the supported document types
        - Bank or building society statement and Utility bill, should state a 3 months validity
        - Council tax letter and Benefits letter should state a 12 months validity
    5. Continue
        - options to continue on phone or upload photo are presented
    6. Choose to upload photo and continue after seeing the recommendations
        - file explorer is displayed so the user can select the photo
    7. Select a valid document photo (image or pdf)
        - image preview can be seen and enlarged
        - image upload can be redone
    8. Click on Upload document
        - submission confirmation screen is displayed
    9. Click on Submit verification
        - user must see a screen representing the end of the flow

    */
    @Scenario(id = "x55", priority = "P1", feature = "Proof of Address")
    @Test(groups = {"chrome", "firefox", "safari", "edge", "ProofOfAddress"}, description = "Proof of Address with 'upload photo'")
    public void ProofOfAddressWithUploadPhoto() {
        /*
        On private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    Go through the flow looking for layout/usability inconsistencies between browsers:

    1. Repeat the test Proof of Address with 'upload photo' in a different browser
        - everything should be displayed properly and layout should not be broken
    */
    @Scenario(id = "x56", priority = "P2", feature = "Proof of Address")
    @Test(groups = {"ProofOfAddress"}, description = "Proof of Address with 'upload photo' - other desktop browsers")
    public void ProofOfAddressWithUploadPhotoOtherDesktopBrowsers() {

        throw new SkipException("Not implemented");
    }


    /*
    1. Repeat the test Proof of Address with 'upload photo' for each of the supported document types
        - Bank or building society statement, Utility bill, Council tax letter and Benefits letter
    */
    @Scenario(id = "x57", priority = "P2", feature = "Proof of Address")
    @Test(groups = {"ProofOfAddress"}, description = "Proof of Address with 'upload photo' - supported document types")
    public void ProofOfAddressWithUploadPhotoSupportedDocumentTypes() {

        throw new SkipException("Not implemented");
    }


    /*
    1. Repeat the test Proof of Address with 'upload photo'  for any country other than UK
        - accepted document types are Bank statement and Utility bill
    */
    @Scenario(id = "x58", priority = "P2", feature = "Proof of Address")
    @Test(groups = {"ProofOfAddress"}, description = "Proof of Address with 'upload photo' - non-UK countries")
    public void ProofOfAddressWithUploadPhotoNonUkCountries() {

        throw new SkipException("Not implemented");
    }


    /*
    1. Repeat the test Proof of Address with 'upload photo'  for all supported file types (images and PDF)
    */
    @Scenario(id = "x59", priority = "P2", feature = "Proof of Address")
    @Test(groups = {"ProofOfAddress"}, description = "Proof of Address with 'upload photo' - supported files")
    public void ProofOfAddressWithUploadPhotoSupportedFiles() {

        throw new SkipException("Not implemented");
    }


    /*
    1. Repeat the test Proof of Address with 'upload photo'  and make sure the user is able to go back in all of the screens
    */
    @Scenario(id = "x60", priority = "P2", feature = "Proof of Address")
    @Test(groups = {"ProofOfAddress"}, description = "Proof of Address with 'upload photo' - previous screen")
    public void ProofOfAddressWithUploadPhotoPreviousScreen() {

        throw new SkipException("Not implemented");
    }


    /*
    1. Repeat the test Proof of Address with 'upload photo'  and make sure the user is able to redo the document upload on step 7
    */
    @Scenario(id = "x61", priority = "P2", feature = "Proof of Address")
    @Test(groups = {"ProofOfAddress"}, description = "Proof of Address with 'upload photo' - redo")
    public void ProofOfAddressWithUploadPhotoRedo() {

        throw new SkipException("Not implemented");
    }


    /*
    1. Repeat the test Proof of Address with 'upload photo'  with invalid documents
    2. Repeat the test Proof of Address with 'upload photo' and disconnect the internet in some steps (e.g: at the document submission)
    */
    @Scenario(id = "x62", priority = "P2", feature = "Proof of Address")
    @Test(groups = {"ProofOfAddress"}, description = "Proof of Address with 'upload photo' - failures")
    public void ProofOfAddressWithUploadPhotoFailures() {

        throw new SkipException("Not implemented");
    }


    /*
    Given user is on proof of address document submission page

    1. Click on Continue on phone button to start cross-device flow
        - user should see Continue on your phone screen
    2. Click on Get secure link button
        - user should see a QR code below the Scan the QR code with your phone sub-title
        - user should also see How to scan a QR code help button below the QR code
    3. Clicking on How to scan a QR code button should display help instructions
    4. Using the mobile phone's Camera app, scan the QR code and open the link on the browser
    5. Mobile browser should load link
        - user should see Submit document screen with Upload and Take photo buttons
    6. Switch to the first tab
        - user should see Connected to your mobile screen
        - user should see an option to cancel
    7. Switch to the second tab upload the document with the option Upload
        - user should be able to upload a document from a mobile device
    8. Switch to the first tab again
        - user should see 'Great, that’s everything we need screen'
        - list of items uploaded should be displayed as
            - 'Proof of address uploaded'
        - user should see the Submit verification button
    9. Submit verification
        - user should see Verification complete screen
    */
    @Scenario(id = "x63", priority = "P1", feature = "Proof of Address")
    @Test(groups = {"chrome", "safari", "android", "ios", "ProofOfAddress"}, description = "Proof of Address cross-device with QR code (Upload)")
    public void ProofOfAddressCrossDeviceWithQrCodeUpload() {
        /*
        On private mode of one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    Given user is on proof of address document submission page

    1. Click on Continue on phone button to start cross-device flow
        - user should see Continue on your phone screen
    2. Click on Get secure link button
        - user should see options to either Get link via SMS or Copy link
    3. Click on Copy link option
    4. Click on Copy button to copy the link
    5. Open new tab and paste the copied link
        - user should see Submit document screen with Upload and Take photo buttons
    6. Switch to the first tab
        - user should see Connected to your mobile screen
        - user should see an option to cancel
    7. Switch to the second tab upload the document with the option Take photo
        - user should be able to upload a document from a mobile device
    8. Switch to the first tab again
        - user should see Great, that’s everything we need screen
        - list of items uploaded should be displayed as
           - Proof of address uploaded
        - user should see the Submit verification button
    9. Submit verification
        - user should see Verification complete screen
    */
    @Scenario(id = "x64", priority = "P1", feature = "Proof of Address")
    @Test(groups = {"chrome", "safari", "android", "ios", "ProofOfAddress"}, description = "Proof of Address cross-device with copied link (Take photo)")
    public void ProofOfAddressCrossDeviceWithCopiedLinkTakePhoto() {
        /*
        On private mode of one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers
        */

        throw new SkipException("Not implemented");
    }


    /*
    1. Replace VERSION with the actual version from the SUT in the link `https://jsfiddle.net/gh/get/library/pure/onfido/onfido-sdk-ui/tree/VERSION/demo/fiddle/` and access it
    2. Add the following options to the `Onfido.init` initialisation params:
    `
    onComplete: () => alert('Completed'), steps: ['welcome', { "type": "document", options: { useLiveDocumentCapture : true }},'complete']
    `

    3. Select passport on the document selector screen
    4. Choose the cross device flow
    5. Click on Get secure link button
    6. Using the mobile phone's Camera app, scan the QR code and open the link on the browser
    7. Click on Continue on your mobile phone
    8. Scan a document
    9. Click on Upload
    10. When you see "Uploads successful" screen go back to your desktop
    11. Click on "Submit verification"
    12. You should see a popup saying "Completed"
    */
    @Scenario(id = "x65", priority = "P3", feature = "Cross device")
    @Test(groups = {"CrossDevice"}, description = "Live document capture cross device mobile")
    public void LiveDocumentCaptureCrossDeviceMobile() {
        /*
        On private mode of one of the desktop and mobile browsers
        */

        throw new SkipException("Not implemented");
    }


}
