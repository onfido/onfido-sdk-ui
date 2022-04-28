package com.onfido.qa.websdk.test;

import org.testng.SkipException;
import org.testng.annotations.Test;

@SuppressWarnings("NonBooleanMethodNameMayNotStartWithQuestion")
public class ReleaseIT extends WebSdkIT {


    /***
    (on private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers)

    Given webcam is connected to the computer

    1. Go through the flow to face capture
       - browser should ask to enable the webcam
    2. Accept the webcam to be used on browser
       - photo capture frame should display preview from webcam
    3. Take photo with a webcam
       - confirmation screen should show up containing photo that was taken
       - user should be able to retake or continue with taken photo
    ***/
    @Test(description = "Face photo webcam capture", groups = {"chrome", "firefox", "safari", "edge"})
    public void facePhotoWebcamCapture() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers)

    Given webcam is connected to the computer

    1. Open link with additional GET parameter `?useWebcam=true`
    2. Go through the flow to document capture
       - browser should ask to enable the webcam
    3. Accept the webcam to be used on browser
       - photo capture frame should display preview from webcam
    4. Place document in front of camera so that it aligns the edges of document capture frame
       - document should be auto-captured
       - confirmation screen should show up containing a photo that was taken
       - user should be able to retake or continue with taken photo
    ***/
    @Test(description = "Document photo webcam auto capture", groups = {"chrome", "firefox", "safari", "edge"})
    public void documentPhotoWebcamAutoCapture() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers)

    Given user is on Passport page

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
    ***/
    @Test(description = "Cross-device with QR code", groups = {"chrome", "firefox", "safari", "edge", "android", "ios"})
    public void crossDeviceWithQrCode() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of: Firefox, Safari, IE11 and Microsoft Edge browsers)

    Given user is on Passport page

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
    ***/
    @Test(description = "Cross-device with copied link", groups = {"firefox", "safari", "ie", "edge"})
    public void crossDeviceWithCopiedLink() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of: Google Chrome, Firefox browsers)

    Given user is on Passport page and link is opened with additional GET parameter `?faceVideo=true`

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
    ***/
    @Test(description = "Cross-device with copied link (with Face video)", groups = {"chrome", "firefox"})
    public void crossDeviceWithCopiedLinkWithFaceVideo() {
        throw new SkipException("not implemented");
    }

    /***
    (on one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers)

    Given user is on upload document page on desktop browser

    1. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
       - user should be able to continue to next screen and provide mobile number from any country
       - user should see the option to send SMS
       - user should see option to copy link
    2. Type valid mobile number connected to mobile test device and click on `Send link` button
       - user should see `Check your mobile` screen
       - user should see option to resend link
       - user should receive SMS on a mobile device
         a. _Additional test:_ Double click on `Send link` button - subsequent steps should be same as above and not skip straight to `Complete` screen
    3. Open link on mobile device (for each mobile browser)
       - user should see `Upload front of document` screen
       - user should be able to upload a document from a mobile device
    ***/
    @Test(description = "Cross-device with SMS", groups = {"chrome", "firefox", "safari", "edge", "ios", "android"})
    public void crossDeviceWithSms() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers)

    Given user is

        1. using the Spanish SDK by opening the link with additional GET parameter `?language=es`
        2. Given user is on upload document page on desktop browser

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
    ***/
    @Test(description = "Cross-device with SMS in Spanish", groups = {"chrome", "firefox", "safari", "edge", "ios", "android"})
    public void crossDeviceWithSmsInSpanish() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of yet another browser)

    Given user is on first page of cross-device flow

    1. **STAGING ONLY:** Type invalid US number (+1 234 567 8912) and click send
       - user should see `Something's gone wrong` error
       - user should persist on the same screen
    ***/
    @Test(description = "Cross-device errors", groups = {"chrome", "firefox", "safari", "edge"})
    public void crossDeviceErrors() {
        throw new SkipException("not implemented");
        /***
    (on private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers)

    Given user is on first page of cross-device flow

    1. Click on the `Copy` button
    2. Open a new tab of the browser
    3. Paste the link
       - user should see `Something's gone wrong` message
       - user should see `You must open this link on a mobile device` message
       - user should see the icon with the phone, screen and the red cross
    ***/}

    @Test(description = "Prevent opening cross-device URL on web browsers", groups = {"chrome", "firefox", "safari", "edge"})
    public void preventOpeningCrossDeviceUrlOnWebBrowsers() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of: Google Chrome, Firefox)

    Given webcam is not connected to the computer

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
    ***/
    @Test(description = "Flow can be completed when transitioning to cross device on the selfie capture step", groups = {"chrome", "firefox"})
    public void flowCanBeCompletedWhenTransitioningToCrossDeviceOnTheSelfieCaptureStep() {
        throw new SkipException("not implemented");
    }

            /*
        (on private mode of: Google Chrome, Firefox)

        Given webcam is connected to the computer

        1. Open link with additional GET parameter `?faceVideo=true`
        2. Upload the ID documents in the browser
        3. On the face video recording screen, wait for the `Check that it is connected and functional. You can also continue verification on your phone` message and select it
        4. Open the cross device link on a mobile device that doesn't have media recorder API support (Chrome on iOS)
           - user should be taken to the selfie intro screen
        5. Open the cross device link on a mobile device that has media recorder API support (Chrome on Android)
           - user should be taken to the liveness intro screen
        6. Complete the liveness video challenges

        Given webcam is not connected to the computer

        1. Open link with additional GET parameter `?faceVideo=true`
        2. Upload the ID documents in the browser
        3. Open the cross device link on a mobile device that doesn't have media recorder API support (Chrome on iOS)
           - user should be taken to the selfie intro screen
        4. Open the cross device link on a mobile device that has media recorder API support (Chrome on Android)
      - user should be taken to the liveness intro screen**
    5. Complete the liveness video challenges
        ***/
    @Test(description = "Cross device transition between browsers with different face video support", groups = {"chrome", "firefox"})
    public void crossDeviceTransitionBetweenBrowsersWithDifferentFaceVideoSupport() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of: Safari, Firefox, IE11 and Microsoft Edge browsers)

    Go through the flow looking for layout/usability inconsistencies between browsers:

    1. Select `passport` document
       - everything should be displayed properly and layout should not be broken
    2. Upload document
       - everything should be displayed properly and layout should not be broken
    3. Upload face photo
       - everything should be displayed properly and layout should not be broken
    ***/
    @Test(description = "Check happy path flow for passports on other desktop browsers", groups = {"safari", "firefox", "ie", "edge"})
    public void checkHappyPathFlowForPassportsOnOtherDesktopBrowsers() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of: Safari, Firefox, IE11 and Microsoft Edge browsers)

    Go through the flow looking for layout/usability inconsistencies between browsers:

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
    ***/
    @Test(description = "Check happy path flow for other document types on other desktop browsers", groups = {"safari", "firefox", "ie", "edge"})
    public void checkHappyPathFlowForOtherDocumentTypesOnOtherDesktopBrowsers() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of: Android Google Chrome and iOS Safari browsers)

    Go through the flow looking for layout/usability inconsistencies between browsers:

    1. Select `passport` document
       - everything should be displayed properly and layout should not be broken
    2. Upload document
       - everything should be displayed properly and layout should not be broken
    3. Upload face photo
       - everything should be displayed properly and layout should not be broken
    ***/
    @Test(description = "Check happy path flow for passports on mobile browsers", groups = {"android", "ios"})
    public void checkHappyPathFlowForPassportsOnMobileBrowsers() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of: Safari, Firefox, IE11 and Microsoft Edge browsers)

    Go through the flow looking for layout/usability inconsistencies between browsers:

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
    ***/
    @Test(description = "Check happy path flow for other document types on other desktop browsers", groups = {"safari", "firefox", "ie", "edge"})
    public void checkHappyPathFlowForOtherDocumentTypesOnOtherDesktopBrowsers2() {
        throw new SkipException("not implemented");
    }

    /***
    (ONLY ON browsers with getUserMedia support: on an iOS and Android device; a laptop with camera; desktop or laptop with a third-party USB camera)

    1. Go to the face step
    2. Move your face to the left
       - Make sure your face also moves to the left on camera feed (like looking at a mirror)
    ***/
    @Test(description = "Check the camera is mirroring", groups = {"getUserMedia"})
    public void checkTheCameraIsMirroring() {
        throw new SkipException("not implemented");
    }

            /*
        (ONLY ON browsers with getUserMedia support: on an iOS and Android device; a laptop with camera; desktop or laptop with a third-party USB camera)

   1. Go to the face step. If on desktop resize the window to less than 480px width wise (if the browser let's you reduce that far)**
    2. The capture component should be fullscreen
        ***/
    @Test(description = "Check the camera is fullscreen on mobile devices/small screens", groups = {"getUserMedia"})
    public void checkTheCameraIsFullscreenOnMobileDevicesSmallScreens() {
        throw new SkipException("not implemented");
    }

    /***
    (ONLY ON browsers with getUserMedia support: on an iOS and Android device; a laptop with camera; desktop or laptop with a third-party USB camera)

    1. On private mode of a browser that has getUserMedia support, go to the face step
    2. User should see a browser notification asking to Allow or Block camera permission
       - Button should appear disabled (darkened out)
       - Click on the camera button
       - Nothing should happen, user does not proceed to next step
    3. Click on browser notification to Allow camera permission
       - Button should become enabled (no longer darkened out)
       - Click on the camera button
       - User proceeds to next step with preview of photo taken
    ***/
    @Test(description = "Check camera button cannot be clicked until camera permission is granted", groups = {"getUserMedia"})
    public void checkCameraButtonCannotBeClickedUntilCameraPermissionIsGranted() {
        throw new SkipException("not implemented");
    }

            /*
        (on any browser)

        1. Go to latest JSFiddle
        2. Add the following options to the `Onfido.init` initialisation params:

        ```json
        language: {
            locale: 'fr',
            phrases: {'welcome.title': 'Ouvrez votre nouveau compte bancaire'}
        }
        ```
    3. Then the title on the welcome screen should be 'Ouvrez votre nouveau compte bancaire'**
        ***/
    @Test(description = "Check that custom strings can be passed", groups = {"chrome", "firefox", "safari", "edge"})
    public void checkThatCustomStringsCanBePassed() {
        throw new SkipException("not implemented");
    }

            /*
        (on any browser)

        1. Go to latest JSFiddle
        2. Add the following options to the `Onfido.init` initialisation params:

        ```json
        language: {
            locale: 'es',
            phrases: {'welcome.title': 'A custom string'}
        }
        ```

   3. Then the title on the welcome screen should be 'A custom string'**
    4. All the other strings should be in Spanish
        ***/
    @Test(description = "Overriding strings for a supported language", groups = {"chrome", "firefox", "safari", "edge"})
    public void overridingStringsForASupportedLanguage() {
        throw new SkipException("not implemented");
    }

            /*
        (on any browser)

        1. Go to latest JSFiddle
        2. Add the following options to the `Onfido.init` initialisation params:

        ```json
        language: {
            locale: 'es',
            mobilePhrases: {'capture.passport.front.title': 'A custom string'}
        }
        ```

        3. Select passport on the document selector screen
        4. Choose the cross device flow and send an SMS to your mobile
        5. The SMS should be in Spanish
        6. When you open the link on your mobile device, the title on the cross device client should be `A custom string`    7. All the other strings should be in Spanish**
        ***/
    @Test(description = "Overriding strings for a supported language on mobile", groups = {"chrome", "firefox", "safari", "edge"})
    public void overridingStringsForASupportedLanguageOnMobile() {
        throw new SkipException("not implemented");
    }

            /*
        _Feature is available on desktop browsers only._
        (on Firefox, Safari, IE11 and Microsoft Edge browsers)

        1. Go through the flow to document capture
        2. Upload a document in PDF format
        3. You should see a confirm screen with the following outcomes

        Outcome:

        - on Safari (and Chrome - this is automated) you should see a preview of the PDF
   - on Firefox, IE11, Microsoft Edge and mobile browsers you should see an icon of a PDF**
        ***/
    @Test(description = "Upload a document in PDF format", groups = {"chrome", "firefox", "safari", "edge"})
    public void uploadADocumentInPdfFormat() {
        throw new SkipException("not implemented");
    }

            /*
        1. Go to latest JSFiddle
        2. Add the following options to the initialisation params:

        ```json
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
        ```

        Outcome:

   - On the document selection screen only "Passport" and "Driver's License" options should be visible.**
        ***/
    @Test(description = "Overriding the document options", groups = {})
    public void overridingTheDocumentOptions() {
        throw new SkipException("not implemented");
    }

            /*
        (on Firefox, Safari and Microsoft Edge browsers)

        1. Go through the flow to document capture
        2. Upload a valid document
        3. Click `Confirm`
        4. You should see a permission priming screen
        5. Click `Enable webcam`    6. You should see the capture screen and camera permissions prompt**
        ***/
    @Test(description = "Check permission priming screen displays when webcam is available and permission was not yet granted", groups = {"firefox", "safari", "edge"})
    public void checkPermissionPrimingScreenDisplaysWhenWebcamIsAvailableAndPermissionWasNotYetGranted() {
        throw new SkipException("not implemented");
    }

            /*
        (on Chrome)

        1. Go through the flow to document capture
        2. Upload a valid document
        3. Click `Confirm`    4. You should see the capture screen**
        ***/
    @Test(description = "Check permission priming screen does not display when webcam is available and permission was already granted", groups = {"chrome"})
    public void checkPermissionPrimingScreenDoesNotDisplayWhenWebcamIsAvailableAndPermissionWasAlreadyGranted() {
        throw new SkipException("not implemented");
    }

            /*
        (on Chrome)

        1. Go through the flow to document capture
        2. Upload a valid document
        3. Click `Confirm`
        4. You should see a permission priming screen
        5. Click `Enable webcam`
        6. You should see the capture screen and camera permissions prompt
        7. Click `Block`    8. You should see the permission denied / recovery screen**
        ***/
    @Test(description = "Check permission denied / recovery screen displays when webcam is available and permission wasn't previously denied and is denied after prompt", groups = {"chrome"})
    public void checkPermissionDeniedRecoveryScreenDisplaysWhenWebcamIsAvailableAndPermissionWasntPreviouslyDeniedAndIsDeniedAfterPrompt() {
        throw new SkipException("not implemented");
    }

            /*
        (on Firefox, Safari and Microsoft Edge browsers)

        1. Go through the flow to document capture
        2. Upload a valid document
        3. Click `Confirm`
        4. You should see a permission priming screen
        5. Click `Enable webcam`    6. You should see the permission denied / recovery screen if the browser does not remember previous decision**
        ***/
    @Test(description = "Check permission denied / recovery screen displays when webcam is available and permission was previously denied", groups = {"firefox", "safari", "edge"})
    public void checkPermissionDeniedRecoveryScreenDisplaysWhenWebcamIsAvailableAndPermissionWasPreviouslyDenied() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers)

    Given webcam is connected to the computer

    1. Go through the flow to face capture
       - browser should ask to enable the webcam
    2. Accept the webcam to be used on browser
       - photo capture frame should display preview from webcam
    3. Wait for 10 seconds
       - A warning should pop up with "Use your mobile" link
    4. Click on "Use your mobile"
       - You should be able to continue on mobile
    ***/
    @Test(description = "Live face capture fallback on Desktop", groups = {"chrome", "firefox", "safari", "edge"})
    public void liveFaceCaptureFallbackOnDesktop() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of getUsermedia supported browser: latest Google Chrome on Android and Safari on iOS11+)

    1. Go through the flow to face capture
       - browser should ask to enable the camera
    2. Accept the camera to be used on browser
       - photo capture frame should display preview from camera
    3. Wait for 8 seconds
       - A warning should pop up asking if you are having problems with the camera
    4. Click on "Try the basic camera mode instead"
       - You should be able to take a picture with your native camera
    ***/
    @Test(description = "Live face capture fallback on mobile", groups = {"android", "ios"})
    public void liveFaceCaptureFallbackOnMobile() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of: Google Chrome and Firefox browsers and Safari 14+)

    Given webcam is connected to the computer

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
    ***/
    @Test(description = "Face video on desktop with webcam", groups = {"chrome", "firefox", "safari14"})
    public void faceVideoOnDesktopWithWebcam() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of: Safari (older than Safari 14) and older Edge browsers (EdgeHTML) - these browsers do not support video recording)

    Given webcam is connected to the computer

    1. Open link with additional GET parameter `?faceVideo=true`
    2. Go through the flow to face capture
    3. You should see a screen that guides you to use your mobile
       - Copy the link
       - Open the link in a new tab
    4. You should see a file uploader to upload a selfie
       - Upload selfie
       - Confirm
    ***/
    @Test(description = "Face video on desktop with webcam", groups = {})
    public void faceVideoOnDesktopWithWebcam2() {
        throw new SkipException("not implemented");
    }

            /*
        (on private mode of: any browser with no webcam OR Safari versions older than 14 and IE11 browsers)

        Given there is no webcam connected to the computer

        1. Open link with additional GET parameter `?faceVideo=true`
        2. Go through the flow to face capture
        3. You should see a screen that guides you to use your mobile - Input mobile number - Send SMS - Click on link on your mobile - Accept camera permissions
           On Android:
           4a. You should see a camera screen - You should be able to submit a video
           On iOS:
           4b. You should see a file uploader to upload a selfie - Upload selfie - Confirm

        ADDITIONAL TEST (for scenario where integrator sets `requestedVariant: 'video'` with no other options set):

        1. Go to latest JSFiddle
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
    3. Should see same flow as from steps 3-4 above**
        ***/
    @Test(description = "Face video on desktop with no video support or no webcam", groups = {})
    public void faceVideoOnDesktopWithNoVideoSupportOrNoWebcam() {
        throw new SkipException("not implemented");
    }

    /***
    (on one of the desktop browsers)

    Given there is no webcam connected to the computer

    1. Open link with additional GET parameter `?countryCode=US`
    2. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
       - user should be able to continue to next screen and provide mobile number from any country
       - user should see the option to send SMS
       - the SMS input flag should be the US flag
    ***/
    @Test(description = "Custom SMS country code and flag", groups = {})
    public void customSmsCountryCodeAndFlag() {
        throw new SkipException("not implemented");
    }

    /***
    (on one of the desktop browsers)

    Given there is no webcam connected to the computer

    1. Open link with additional GET parameter `?countryCode=ABCD`
    2. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
       - user should be able to continue to next screen and provide mobile number from any country
       - user should see the option to send SMS
       - the SMS input flag should be the UK one
    ***/
    @Test(description = "Custom SMS with invalid country code", groups = {})
    public void customSmsWithInvalidCountryCode() {
        throw new SkipException("not implemented");
    }

    /***
    Given user opened the link with `?uploadFallback=false` flag

    1. And user is on first page of cross-device flow
    2. Open the cross device link on mobile browsers with a working webcam
       - user should be able to complete the cross-device flow successfully

    Given user opened the link with `?uploadFallback=false` flag

    1. And user is on first page of cross-device flow
    2. Open the cross device link on mobile browsers with a malfunctioning camera or on mobile browsers that do not support getUserMedia (i.e. Safari on iOS10.3 or earlier, Chrome on iOS)
       - user won't see the "use the native camera mode instead" link
       - user should see `Unsupported browser` message
       - user should see `Restart the process on the latest version of Safari/Chrome` message
       - user should NOT be able to complete the cross-device flow successfully.

    Given user opened the link with `?uploadFallback=false` flag

    1. And user is on first page of cross-device flow
    2. Open the cross device link on mobile browser without a camera
       - user should not be able to upload documents
       - user should not be able to record the face video
       - user should see `Unsupported browser` message
       - user should see `Restart the process on the latest version of Safari/Chrome` message
       - user should see the icon with the phone, screen and the red cross
    ***/
    @Test(description = "Prevent upload fallback when requested", groups = {})
    public void preventUploadFallbackWhenRequested() {
        throw new SkipException("not implemented");
    }

    /***
    (on one of the desktop browsers)

    1. Open link with additional GET parameter `?smsNumber=+447955555555`
    2. Go to the document capture step
    3. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
       - user should see that the SMS input has been pre-filled with the number provided at the beginning
       - if the number is correct the user should be able to successfully send an SMS
       - if the number is invalid the user will see an error when clicking "Send link"
    ***/
    @Test(description = "Custom SMS number", groups = {})
    public void customSmsNumber() {
        throw new SkipException("not implemented");
    }

    /***
    (desktop and mobile browsers)

    1. Upload a document
    2. Click "Enlarge image"
    3. Click browser's back button while document is zoomed in
       - "Check your image" text and back arrow retain the colour
       - Back navigation in the browser doesn't cause any other UI changes in the SDK
    ***/
    @Test(description = "Browse back after enlarging the document", groups = {})
    public void browseBackAfterEnlargingTheDocument() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of both Android Chrome and Safari on iOS11+ mobile browsers)

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
    ***/
    @Test(description = "Check happy path flow of live document capture on mobile devices with media recorder API support", groups = {})
    public void checkHappyPathFlowOfLiveDocumentCaptureOnMobileDevicesWithMediaRecorderApiSupport() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of Google Chrome on Android and Safari on iOS11+)

    1. Open link with additional GET parameter `?useLiveDocumentCapture=true&uploadFallback=true`
    2. Go through the flow to document capture
       - browser should ask to enable the camera
    3. Accept the camera to be used on browser
       - photo capture frame should display preview from camera
    4. Wait for 10 seconds
       - A warning should pop up asking if you are having problems with the camera
    5. Click on "Try the basic camera mode instead"
       - You should be able to take a picture with your native camera
    ***/
    @Test(description = "Live document capture fallback on mobile", groups = {})
    public void liveDocumentCaptureFallbackOnMobile() {
        throw new SkipException("not implemented");
    }

    /***
    (private mode for browsers on Microsoft Surface or other hybrid device)

    1. Open link with additional GET parameter `?useLiveDocumentCapture=true`
    2. Go through the flow to document capture
       - browser should ask to enable the camera
    3. Accept the camera to be used on browser
       - photo capture frame should display preview from camera
    4. Wait for 10 seconds
       - A warning should pop up asking if you are having problems with the camera
    5. Click on "continue verification on your phone"
       - You should be able to switch to the cross device flow and use a mobile device to capture a document
    ***/
    @Test(description = "Live document capture fallback on Hybrid", groups = {})
    public void liveDocumentCaptureFallbackOnHybrid() {
        throw new SkipException("not implemented");
    }

    /***
    (private mode for mobile browsers, browsers on Ipad, and browsers on Microsoft Surface or other hybrid device)

    1. Open link with additional GET parameter `?useLiveDocumentCapture=true`
    2. Go through the flow to document capture
       - browser should ask to enable the camera
    3. Accept the camera to be used on browser
       - photo capture frame should display preview from camera
       - camera should be rear/environment facing
    ***/
    @Test(description = "Live document capture facingMode: {exact: \"environment\"} constraint", groups = {})
    public void liveDocumentCaptureFacingModeExactEnvironmentConstraint() {
        throw new SkipException("not implemented");
    }

    /***
    (private mode for desktop browsers, not on Surface or other hybrid device, OR if on hybrid device, with rear camera disabled through device manager)

    1. Open link with additional GET parameter `?useLiveDocumentCapture=true`
    2. Go through the flow to document capture
       - browser should disregard the request for live document capture
       - browser should direct to the normal desktop flow options of cross device or document upload
    ***/
    @Test(description = "Live document capture attempt on non hybrid desktop", groups = {})
    public void liveDocumentCaptureAttemptOnNonHybridDesktop() {
        throw new SkipException("not implemented");
    }

    /***
    Given user opened the link with `?faceVideo=true&photoCaptureFallback=false` flags

    1. And user is on first page of cross-device flow
    2. Open the cross device link on mobile browsers that don't support MediaRecorder (i.e. Safari on iOS13.7 or earlier):
       - user won't see the "use the native camera mode instead" link
       - user should see `Unsupported browser` message
       - user should see `Restart the process on the latest version of Safari/Chrome` message
       - user should NOT be able to complete the cross-device flow successfully.
    ***/
    @Test(description = "Interrupt flow if selfie fallback is deactivated and MediaRecorder is not supported", groups = {})
    public void interruptFlowIfSelfieFallbackIsDeactivatedAndMediaRecorderIsNotSupported() {
        throw new SkipException("not implemented");
    }

            /*
        (on private mode of: Chrome, Firefox, Safari, IE11 and Microsoft Edge browsers)

        There are new journeys to explore, once at the ‘Choose document’ screen, they are the following:

        - Residence permit (this will invoke the Card Flow)
        - Passport (Any country will invoke this)
        - Identity Card > choose Italy from country list (we will test Paper Identity Card in this flow)
        - Drivers’ License > choose France from country list (we will test Paper Drivers’ License in this flow)

        1. Open the landing page with the additional GET parameters (language and docVideo)
           `?language=en_US&docVideo=true`
        2. Choose one of the documents mentioned above (Residence permit (any country), Passport (any country), Identity Card (Italy) or Drivers License (France)
        3. Choose to continue on your phone by clicking on ‘Get secure Link’
        4. Choose to get the link via SMS, QR Code or Copy (you can use the steps in '4a.Cross-device with copied link' as a reference)
        5. Open the provided cross device URL in your mobile browser.

        Specific for Passport:

        - There is only a single step, you will only be requested to scan the front side / single side
        - The flash should not come on during the process
        - You will be shown a progress bar during the scan (after pressing ‘Next Step’)
        - You should not see any messages mentioning 'Step x of y'

        Specific for Residence Permit, Drivers License:

        - These will have a 2 Step process and the messaging should reflect this
        - You should see messages mentioning 'Step x of y'
        - The flash should not come on
        - You should not see a progress bar

        Specific for Identity Card and Drivers License (As above, plus…):

        - You should see a 'options tile’ that appears at the start of the journey asking you if you have a Plastic card or Paper document.

        Common for all document types…

        - After pressing 'start recording' capture your document within the frame
        - Upon successful completion you will be taken to a 'success' screen with the heading of ‘That’s all we need to start verifying your identity’
        - From here you will be able to the following…
          - Upload your video
          - Preview your video (from here you can also choose to Upload or Retake)
          - Go back by pressing the 'Back' arrow in the toolbar.

        Things to check for across all document types:

        - The messaging / hints on each type of journey make sense to that journey, i.e. you should not see Passport related messages when testing Driving License, etc
        - You should see 'Step x of y' messages where appropriate (you should NOT see this for Passport flows)

        - Try to capture the documents outside of the frame
        - Try to exceed the timeout for recording the video (this is currently set to 30 seconds), an appropriate message is seen.
        - Try to leave the flow mid way, letting your device lock and then unlock, does the app remember its state and continue as expected
        - Check the toolbar headings
        - Check the general messaging
        - Check that the overlays used make sense
        - Try pressing the buttons when they are ‘disabled’

        Things that would be nice to try and capture:

        - Memory used...is there significant memory usage when taking video?
        - Data used...is there excessive data being used when taking video?
        - If you are constantly retaking the video, does the app still perform? (will it crash?)
        - What happens if/when your data/Wi-Fi fails during uploading a video?
        - What happens when you try to rotate the device during the flows?

        Known Issues:

   - On Android, after completing the flow and attempting to play the video for the very first time, you’re unable to use the controls as expected. After it is played for the first time, the controls are then usable. This is because we don't know the duration precisely until the video was loaded for the first time.**
        ***/
    @Test(description = "Cross Device for ANSSI Document Liveness", groups = {})
    public void crossDeviceForAnssiDocumentLiveness() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of: Google Chrome, Firefox, Safari and Microsoft Edge browsers)

    1. Start the proof of address verification. To include Proof of Address flow step, there are two options:
       - Add ?poa=true to the end of the url. Using this option, the flow will be composed of: PoA + Doc + Face. E.g: https://latest-onfido-sdk-ui-onfido.surge.sh/?poa=true.
       - On the Developer Tools > Console, run `onfidoSdkHandle.setOptions({steps: [{type: 'poa'}]})`. This will run the flow with PoA as the only step.
    2. Advance to Country Select Screen
       - choose a country from the list
    3. Advance to document submission
       - if the country selected was the UK: accepted document types are `Bank or building society statement`, `Utility bill`, `Council tax letter` and `Benefits letter`
       - if the country selected was not the UK: accepted document types are `Bank statement` and `Utility bill`
    4. Pick one of the supported document types
       - `Bank or building society statement` and `Utility bill`, should state a 3 months validity
       - `Council tax letter` and `Benefits letter` should state a 12 months validity
    5. Continue
       - options to `continue on phone` or `upload photo` are presented
    6. Choose to `upload photo` and continue after seeing the recommendations
       - file explorer is displayed so the user can select the photo
    7. Select a valid document photo (image or pdf)
       - image preview can be seen and enlarged
       - image upload can be redone
    8. Click on `Upload document`
       - submission confirmation screen is displayed
    9. Click on `Submit verification`
       - user must see a screen representing the end of the flow
    ***/
    @Test(description = "Proof of Address with 'upload photo'", groups = {})
    public void proofOfAddressWithUploadPhoto() {
        throw new SkipException("not implemented");
    }

    /***
    Go through the flow looking for layout/usability inconsistencies between browsers:

    1. Repeat the test `40a. Proof of Address with 'upload photo'` in a different browser
       - everything should be displayed properly and layout should not be broken
    ***/
    @Test(description = "Proof of Address with 'upload photo' - other desktop browsers", groups = {})
    public void proofOfAddressWithUploadPhotoOtherDesktopBrowsers() {
        throw new SkipException("not implemented");
    }

    /***
    1. Repeat the test `40a. Proof of Address with 'upload photo'` for each of the supported document types
       - `Bank or building society statement`, `Utility bill`, `Council tax letter` and `Benefits letter`
    ***/
    @Test(description = "Proof of Address with 'upload photo' - supported document types", groups = {})
    public void proofOfAddressWithUploadPhotoSupportedDocumentTypes() {
        throw new SkipException("not implemented");
    }

    /***
    1. Repeat the test `40a. Proof of Address with 'upload photo'` for any country other than UK
       - accepted document types are `Bank statement` and `Utility bill`
    ***/
    @Test(description = "Proof of Address with 'upload photo' - non-UK countries", groups = {})
    public void proofOfAddressWithUploadPhotoNonUkCountries() {
        throw new SkipException("not implemented");
    }

            /*    1. Repeat the test `40a. Proof of Address with 'upload photo'` for all supported file types (images and PDF)**
        ***/
    @Test(description = "Proof of Address with 'upload photo' - supported files", groups = {})
    public void proofOfAddressWithUploadPhotoSupportedFiles() {
        throw new SkipException("not implemented");
    }

            /*    1. Repeat the test `40a. Proof of Address with 'upload photo'` and make sure the user is able to go back in all of the screens**
        ***/
    @Test(description = "Proof of Address with 'upload photo' - previous screen", groups = {})
    public void proofOfAddressWithUploadPhotoPreviousScreen() {
        throw new SkipException("not implemented");
    }

            /*    1. Repeat the test `40a. Proof of Address with 'upload photo'` and make sure the user is able to redo the document upload on step 7**
        ***/
    @Test(description = "Proof of Address with 'upload photo' - redo", groups = {})
    public void proofOfAddressWithUploadPhotoRedo() {
        throw new SkipException("not implemented");
    }

            /*
   1. Repeat the test `40a. Proof of Address with 'upload photo'` with invalid documents**
    2. Repeat the test `40a. Proof of Address with 'upload photo'` and disconnect the internet in some steps (e.g: at the document submission)
        ***/
    @Test(description = "Proof of Address with 'upload photo' - failures", groups = {})
    public void proofOfAddressWithUploadPhotoFailures() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers)

    Given user is on proof of address document submission page

    1. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
    2. Click on `Get secure link` button
       - user should see a QR code below the `Scan the QR code with your phone` sub-title
       - user should also see `How to scan a QR code` help button below the QR code
    3. Clicking on `How to scan a QR code` button should display help instructions
    4. Using the mobile phone's Camera app, scan the QR code and open the link on the browser
    5. Mobile browser should load link
       - user should see `Submit document` screen with `Upload` and `Take photo` buttons
    6. Switch to the first tab
       - user should see `Connected to your mobile` screen
       - user should see an option to cancel
    7. Switch to the second tab upload the document with the option `Upload`
       - user should be able to upload a document from a mobile device
    8. Switch to the first tab again
       - user should see `Great, that’s everything we need` screen
       - list of items uploaded should be displayed as
         - `Proof of address uploaded`
       - user should see the `Submit verification` button
    9. Submit verification
       - user should see `Verification complete` screen
    ***/
    @Test(description = "Proof of Address cross-device with QR code (Upload)", groups = {})
    public void proofOfAddressCrossDeviceWithQrCodeUpload() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers)

    Given user is on proof of address document submission page

    1. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
    2. Click on `Get secure link` button
       - user should see a QR code below the `Scan the QR code with your phone` sub-title
       - user should also see `How to scan a QR code` help button below the QR code
    3. Clicking on `How to scan a QR code` button should display help instructions
    4. Using the mobile phone's Camera app, scan the QR code and open the link on the browser
    5. Mobile browser should load link
       - user should see `Submit document` screen with `Upload` and `Take photo` buttons
    6. Switch to the first tab
       - user should see `Connected to your mobile` screen
       - user should see an option to cancel
    7. Switch to the second tab upload the document with the option `Take photo`
       - user should be able to upload a document from a mobile device
    8. Switch to the first tab again
       - user should see `Great, that’s everything we need` screen
       - list of items uploaded should be displayed as
         - `Proof of address uploaded`
       - user should see the `Submit verification` button
    9. Submit verification
       - user should see `Verification complete` screen
    ***/
    @Test(description = "Proof of Address cross-device with QR code (Take photo)", groups = {})
    public void proofOfAddressCrossDeviceWithQrCodeTakePhoto() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers)

    Given user is on proof of address document submission page

    1. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
    2. Click on `Get secure link` button
       - user should see a QR code below the `Scan the QR code with your phone` sub-title
       - user should also see `How to scan a QR code` help button below the QR code
    3. Clicking on `How to scan a QR code` button should display help instructions
    4. Using the mobile phone's Camera app, scan the QR code and open the link on the browser
    5. Mobile browser should load link
       - user should see `Submit document` screen with `Upload` and `Take photo` buttons
    6. Switch to the first tab
       - user should see `Connected to your mobile` screen
       - user should see an option to cancel
    7. Click `Cancel`
       - user should be able to cancel the flow
    ***/
    @Test(description = "Proof of Address cross-device with QR code - cancel", groups = {})
    public void proofOfAddressCrossDeviceWithQrCodeCancel() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers)

    Given user is on proof of address document submission page

    1. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
    2. Click on `Get secure link` button
       - user should see a QR code below the `Scan the QR code with your phone` sub-title
       - user should also see `How to scan a QR code` help button below the QR code
    3. Clicking on `How to scan a QR code` button should display help instructions
    4. Using the mobile phone's Camera app, scan the QR code and open the link on the browser
    5. Mobile browser should load link
       - user should see `Submit document` screen with `Upload` and `Take photo` buttons
    6. Switch to the first tab
       - user should see `Connected to your mobile` screen
       - user should see an option to cancel
    7. Switch to the second tab upload the document with the option `Upload`
       - user should be able to upload a document from a mobile device
    8. Click `Redo` and repeat the previous step
    9. Switch to the first tab again
       - user should see `Great, that’s everything we need` screen
       - list of items uploaded should be displayed as
         - `Proof of address uploaded`
       - user should see the `Submit verification` button
    10. Submit verification
        - user should see `Verification complete` screen
    ***/
    @Test(description = "Proof of Address cross-device with QR code (Upload - redo)", groups = {})
    public void proofOfAddressCrossDeviceWithQrCodeUploadRedo() {
        throw new SkipException("not implemented");
    }

            /*
        (on private mode of one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers)

        Given user is on proof of address document submission page

        1. Click on `Continue on phone` button to start cross-device flow
           - user should see `Continue on your phone` screen
        2. Click on `Get secure link` button
           - user should see a QR code below the `Scan the QR code with your phone` sub-title
           - user should also see `How to scan a QR code` help button below the QR code
        3. Clicking on `How to scan a QR code` button should display help instructions
        4. Using the mobile phone's Camera app, scan the QR code and open the link on the browser
        5. Mobile browser should load link
           - user should see `Submit document` screen with `Upload` and `Take photo` buttons
        6. Switch to the first tab
           - user should see `Connected to your mobile` screen
           - user should see an option to cancel
        7. Switch to the second tab upload the document with the option `Take photo`
           - user should be able to upload a document from a mobile device
        8. Click `Redo` and repeat the previous step
        9. Switch to the first tab again
           - user should see `Great, that’s everything we need` screen
           - list of items uploaded should be displayed as
             - `Proof of address uploaded`
           - user should see the `Submit verification` button
        10. Submit verification

   - user should see `Verification complete` screen**
        ***/
    @Test(description = "Proof of Address cross-device with QR code (Take photo - redo)", groups = {})
    public void proofOfAddressCrossDeviceWithQrCodeTakePhotoRedo() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of: Firefox, Safari, IE11 and Microsoft Edge browsers)

    Given user is on proof of address document submission page

    1. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
    2. Click on `Get secure link` button
       - user should see options to either `Get link via SMS` or `Copy link`
    3. Click on `Copy link` option
    4. Click on `Copy` button to copy the link
    5. Open new tab and paste the copied link
       - user should see `Submit document` screen with `Upload` and `Take photo` buttons
    6. Switch to the first tab
       - user should see `Connected to your mobile` screen
       - user should see an option to cancel
    7. Switch to the second tab upload the document with the option `Upload`
       - user should be able to upload a document from a mobile device
    8. Switch to the first tab again
       - user should see `Great, that’s everything we need` screen
       - list of items uploaded should be displayed as
         - `Proof of address uploaded`
       - user should see the `Submit verification` button
    9. Submit verification
       - user should see `Verification complete` screen
    ***/
    @Test(description = "Proof of Address cross-device with copied link (Upload)", groups = {})
    public void proofOfAddressCrossDeviceWithCopiedLinkUpload() {
        throw new SkipException("not implemented");
    }

    /***
    (on private mode of: Firefox, Safari, IE11 and Microsoft Edge browsers)

    Given user is on proof of address document submission page

    1. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
    2. Click on `Get secure link` button
       - user should see options to either `Get link via SMS` or `Copy link`
    3. Click on `Copy link` option
    4. Click on `Copy` button to copy the link
    5. Open new tab and paste the copied link
       - user should see `Submit document` screen with `Upload` and `Take photo` buttons
    6. Switch to the first tab
       - user should see `Connected to your mobile` screen
       - user should see an option to cancel
    7. Switch to the second tab upload the document with the option `Take photo`
       - user should be able to upload a document from a mobile device
    8. Switch to the first tab again
       - user should see `Great, that’s everything we need` screen
       - list of items uploaded should be displayed as
         - `Proof of address uploaded`
       - user should see the `Submit verification` button
    9. Submit verification
       - user should see `Verification complete` screen
    ***/
    @Test(description = "Proof of Address cross-device with copied link (Take photo)", groups = {})
    public void proofOfAddressCrossDeviceWithCopiedLinkTakePhoto() {
        throw new SkipException("not implemented");
    }

    /***
    (on one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers)

    Given user is on proof of address document submission page

    1. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
       - user should be able to continue to next screen and provide mobile number from any country
       - user should see the option to send SMS
       - user should see option to copy link
    2. Type valid mobile number connected to mobile test device and click on `Send link` button
       - user should see `Check your mobile` screen
       - user should see option to resend link
       - user should receive SMS on a mobile device
         a. _Additional test:_ Double click on `Send link` button - subsequent steps should be same as above and not skip straight to `Complete` screen
    3. Open link on mobile device (for each mobile browser)
       - user should see `Submit document` screen with `Upload` and `Take photo` buttons
    4. Switch to the first tab
       - user should see `Connected to your mobile` screen
       - user should see an option to cancel
    5. Switch to the second tab upload the document with the option `Upload`
       - user should be able to upload a document from a mobile device
    6. Switch to the first tab again
       - user should see `Great, that’s everything we need` screen
       - list of items uploaded should be displayed as
         - `Proof of address uploaded`
       - user should see the `Submit verification` button
    7. Submit verification
       - user should see `Verification complete` screen
    ***/
    @Test(description = "Proof of Address cross-device with SMS (Upload)", groups = {})
    public void proofOfAddressCrossDeviceWithSmsUpload() {
        throw new SkipException("not implemented");
    }

    /***
    (on one of the desktop browsers and both Android Chrome and iOS Safari mobile browsers)

    Given user is on proof of address document submission page

    1. Click on `Continue on phone` button to start cross-device flow
       - user should see `Continue on your phone` screen
       - user should be able to continue to next screen and provide mobile number from any country
       - user should see the option to send SMS
       - user should see option to copy link
    2. Type valid mobile number connected to mobile test device and click on `Send link` button
       - user should see `Check your mobile` screen
       - user should see option to resend link
       - user should receive SMS on a mobile device
         a. _Additional test:_ Double click on `Send link` button - subsequent steps should be same as above and not skip straight to `Complete` screen
    3. Open link on mobile device (for each mobile browser)
       - user should see `Submit document` screen with `Upload` and `Take photo` buttons
    4. Switch to the first tab
       - user should see `Connected to your mobile` screen
       - user should see an option to cancel
    5. Switch to the second tab upload the document with the option `Take photo`
       - user should be able to upload a document from a mobile device
    6. Switch to the first tab again
       - user should see `Great, that’s everything we need` screen
       - list of items uploaded should be displayed as
         - `Proof of address uploaded`
       - user should see the `Submit verification` button
    7. Submit verification
       - user should see `Verification complete` screen

    ## Non-functional
    ***/
    @Test(description = "Proof of Address cross-device with SMS (Take photo)", groups = {})
    public void proofOfAddressCrossDeviceWithSmsTakePhoto() {
        throw new SkipException("not implemented");
    }

    /***
    (on one browser)

    With Web SDK project open in Woopra

    1. Go through the normal flow for any document
       - all events should be tracked
       - no events should be duplicated
    2. Now repeat the same for cross-device; go through the flow for any document
       - all events should be tracked
       - no events should be duplicated
    ***/
    @Test(description = "Check analytics tracking", groups = {})
    public void checkAnalyticsTracking() {
        throw new SkipException("not implemented");
    }

    /***
    Given local `.node_modules` folder is removed (not existing)

    1. Run `npm install`
       - dependencies should be installed successfully

    ## Accessibility
    ***/
    @Test(description = "NPM packages installation", groups = {})
    public void npmPackagesInstallation() {
        throw new SkipException("not implemented");
    }

    /***
    1. Before launching the TestApp, go to Settings - (some iOS versions - General) - Accessibility - Larger text/Display & Text Size
    2. Turn ON `Larger Text` option
    3. Set text size picker to the largest one
    4. Open the test link on Chrome or Safari on mobile device
    5. Make sure:
       - All the screens reflect the changes applied in the Settings
       - If the whole text is not visible, you should have the possibility to scroll through the screen and be able to read the whole text
       - None of the strings is cut off
    ***/
    @Test(description = "Dynamic font size on iOS devices", groups = {})
    public void dynamicFontSizeOnIOsDevices() {
        throw new SkipException("not implemented");
    }

    /***
    1. Before launching the TestApp, go to Settings and find the option within the Accessibility section for Font size. Location of such settings varies across the device models.
    2. Set text size picker to the largest one
    3. Open the test link on Chrome mobile browser
    4. Make sure:
       - All the screens reflect the changes applied in the Settings
       - If the whole text is not visible, you should have the possibility to scroll through the screen and be able to read the whole text
       - None of the strings is cut off
    ***/
    @Test(description = "Dynamic font size on Android devices", groups = {})
    public void dynamicFontSizeOnAndroidDevices() {
        throw new SkipException("not implemented");
    }

    /***
    Quick guide how to use VoiceOver - https://youtu.be/qDm7GiKra28

    1. Before launching the TestApp, go to Settings - (some iOS versions - General) - Accessibility - VoiceOver
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
    ***/
    @Test(description = "Screen reader on iOS devices - VoiceOver", groups = {})
    public void screenReaderOnIOsDevicesVoiceOver() {
        throw new SkipException("not implemented");
    }

}
